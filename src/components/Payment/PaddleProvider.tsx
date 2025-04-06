import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    Paddle: any;
  }
}

interface PaddleContextType {
  isPaddleLoaded: boolean;
  openCheckout: (priceId: string) => Promise<void>;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
};

export const PaddleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaddleLoaded, setIsPaddleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PaddleProvider: Initializing Paddle...');
    
    // Check if Paddle is already loaded
    if (window.Paddle) {
      console.log('PaddleProvider: Paddle already loaded, setting up...');
      setupPaddle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    
    script.onload = () => {
      console.log('PaddleProvider: Script loaded successfully');
      setupPaddle();
    };

    script.onerror = (error) => {
      console.error('PaddleProvider: Failed to load Paddle script:', error);
      setError('Failed to load payment system. Please check your internet connection and try again.');
    };

    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src*="paddle.js"]');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  const updateUserSubscription = async (subscriptionId: string, subscriptionStatus: string, cardBrand: string, cardLastFour: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Get current date in Israel timezone
      const now = new Date();
      const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
      

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/payments/update-user-data`,
        {
          subscriptionId,
          subscriptionStatus,
          cardBrand,
          cardLastFour,
          firstPaymentDate: israelTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local storage with new user data
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const updatedUserData = {
            ...userData,
            ...response.data.user
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  };

  const setupPaddle = () => {
    try {
      console.log('PaddleProvider: Setting up Paddle...');
      console.log('PaddleProvider: Using client token:', import.meta.env.VITE_PADDLE_CLIENT_TOKEN);
      
      window.Paddle.Initialize({
        token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
        eventCallback: async function(event: any) {
          console.log('PaddleProvider: Paddle event received:', {
            event: event.name,
            data: event
          });
          
          // Handle successful payment event
          if (event.name === 'checkout.completed') {
            setTimeout(() => {
              console.log('PaddleProvider: Checkout completed event received');
              console.log('PaddleProvider: Checkout data:', event);
            }, 3000);

            try {
              // Extract transaction ID from the event data
              console.log('PaddleProvider: Event data structure:', JSON.stringify(event.data, null, 2));
              console.log('PaddleProvider: Raw transaction_id:', event.data?.transaction_id);
              console.log('PaddleProvider: Raw event.data:', event.data);
              const transactionId = event.data?.transaction_id;
              console.log('PaddleProvider: Transaction ID:', transactionId);
              
              if (!transactionId) {
                console.error('PaddleProvider: No transaction ID found in checkout data');
                return;
              }
              
              // Extract card information from the event data
              const cardInfo = event.data?.payment?.method_details?.card;
              console.log('PaddleProvider: Raw card info:', cardInfo);
              const cardBrand = cardInfo?.type || '';
              const cardLastFour = cardInfo?.last4 || '';
              localStorage.setItem('cardBrand', cardBrand);
              localStorage.setItem('cardLastFour', cardLastFour);
              console.log('PaddleProvider: Extracted card details:', { cardBrand, cardLastFour });
              
              // Make API call to Paddle to get transaction details
              try {
                console.log('PaddleProvider: Fetching transaction details from Paddle API');
                const response = await axios.get(
                  `${import.meta.env.VITE_PADDLE_API_URL}/transactions/${transactionId}`,
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                );
                
                console.log('PaddleProvider: Transaction details response:', response.data);
                console.log('PaddleProvider: Transaction status:', response.data.data.status);
                console.log('PaddleProvider: Transaction data structure:', JSON.stringify(response.data.data, null, 2));
                
                if (response.data.data.status !== "completed") {
                  console.error('PaddleProvider: Transaction not completed:', response.data.data.status);
                  // Still redirect to success page with transaction ID
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?transaction_id=${encodeURIComponent(transactionId)}&t=${Date.now()}&cardbrand=${cardBrand}&cardlastfour=${cardLastFour}`;
                  console.log('PaddleProvider: Redirecting to success URL (transaction not completed):', successUrl);
                  window.location.href = successUrl;
                  return;
                }
                
                // Extract subscription ID from the transaction details
                const subscriptionId = response.data.data.subscription_id;
                console.log('PaddleProvider: Subscription ID from API:', subscriptionId);
                
                if (!subscriptionId) {
                  console.error('PaddleProvider: No subscription ID found in transaction details');
                  // Still redirect to success page with transaction ID
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?transaction_id=${encodeURIComponent(transactionId)}&t=${Date.now()}&cardbrand=${cardBrand}&cardlastfour=${cardLastFour}`;
                  await updateUserSubscription(subscriptionId, 'active', cardBrand, cardLastFour);
                  console.log('PaddleProvider: Redirecting to success URL (no subscription ID):', successUrl);
                  window.location.href = successUrl;
                  return;
                }
                
                // Update user subscription data with card information
                console.log('PaddleProvider: Updating user subscription with card details:', { cardBrand, cardLastFour });
                const result = await updateUserSubscription(subscriptionId, 'active', cardBrand, cardLastFour);
                
                if (result) {
                  console.log('PaddleProvider: User subscription updated successfully with card details');
                } else {
                  console.log('PaddleProvider: User subscription update completed');
                }

                // set hold time  for 3 seconds until redirect to success page
                setTimeout(() => {
                  // Redirect to success page with transaction ID
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?transaction_id=${encodeURIComponent(transactionId)}&t=${Date.now()}&cardbrand=${cardBrand}&cardlastfour=${cardLastFour}`;
                  console.log('PaddleProvider: Redirecting to success URL:', successUrl);
                  window.location.href = successUrl;
                }, 3000);
              } catch (error) {
                console.error('PaddleProvider: Error fetching transaction details:', error);
                // Still redirect to success page with transaction ID
                setTimeout(() => {
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?transaction_id=${encodeURIComponent(transactionId)}&t=${Date.now()}&cardbrand=${cardBrand}&cardlastfour=${cardLastFour}`;
                  console.log('PaddleProvider: Redirecting to success URL (after API error):', successUrl);
                  window.location.href = successUrl;
                }, 6000);

              }
            } catch (error) {
              console.error('PaddleProvider: Error in checkout completion:', error);
              // Don't set error state, just log it
            }
          }
        }
      });
      console.log('PaddleProvider: Setup complete');
      setIsPaddleLoaded(true);
    } catch (error) {
      console.error('PaddleProvider: Error setting up Paddle:', error);
      setError('Failed to initialize payment system. Please try again later.');
    }
  };

  const openCheckout = async (priceId: string) => {
    console.log('PaddleProvider: openCheckout called with priceId:', priceId);
    console.log('PaddleProvider: isPaddleLoaded:', isPaddleLoaded);
    
    if (!isPaddleLoaded) {
      console.error('PaddleProvider: Paddle is not loaded yet');
      throw new Error('Paddle is not loaded yet');
    }

    if (!window.Paddle) {
      console.error('PaddleProvider: Paddle object not found');
      throw new Error('Payment system not initialized');
    }

    try {
      // Get user email from localStorage
      const userDataString = localStorage.getItem('user');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      
      console.log('PaddleProvider: Opening checkout...');
      console.log('PaddleProvider: User data:', userData);
      console.log('PaddleProvider: Using product ID:', import.meta.env.VITE_PADDLE_PRODUCT_ID);
      
      // Create a unique success URL with timestamp to prevent caching
      const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?t=${Date.now()}`;
      console.log('PaddleProvider: Success URL:', successUrl);
      
      window.Paddle.Checkout.open({
        items: [{
          priceId: priceId,
          quantity: 1,
        }],
        settings: {
          theme: 'light',
          displayMode: 'overlay',
          locale: 'en',
          successUrl: successUrl,
          closeCallback: function() {
            console.log('PaddleProvider: Checkout closed');
          }
        },
        customData: userData ? {
          user_id: userData.id
        } : undefined,
        customer: userData ? {
          email: userData.email,
          name: userData.name
        } : undefined,
      });
      console.log('PaddleProvider: Checkout opened successfully');
      
    } catch (error) {
      console.error('PaddleProvider: Error opening checkout:', error);
      throw error;
    }
  };

  if (error) {
    console.error('PaddleProvider: Error state:', error);
  }

  return (
    <PaddleContext.Provider value={{ isPaddleLoaded, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
}; 