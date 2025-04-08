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
            console.log('PaddleProvider: Checkout completed event received');
            console.log('PaddleProvider: Checkout data:', event);

            try {
              // Extract transaction ID from the event data
              console.log('PaddleProvider: Event data structure:', JSON.stringify(event.data, null, 2));
              const transactionId = event.data?.transaction_id;
              localStorage.setItem('transactionId', transactionId);
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
              console.log('PaddleProvider: Extracted card details:', { cardBrand, cardLastFour });
              
              // Make API call to our backend to verify transaction
              try {
                console.log('PaddleProvider: Verifying transaction through backend');
                const response = await axios.get(
                  `${import.meta.env.VITE_BASE_API}/api/payments/verify-transaction/${transactionId}?cardbrand=${cardBrand}&cardlastfour=${cardLastFour}`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                      cardbrand: cardBrand,
                      cardlastfour: cardLastFour
                    }
                  }
                );
                
                console.log('PaddleProvider: Transaction verification response:', response.data);
                
                if (response.data.message === 'Transaction verified successfully') {
                  console.log('PaddleProvider: Transaction verified successfully');
                  // Redirect to success page with transaction ID
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?t=${Date.now()}&transaction_id=${encodeURIComponent(transactionId)}&cardbrand=${encodeURIComponent(cardBrand)}&cardlastfour=${encodeURIComponent(cardLastFour)}`;
                  console.log('PaddleProvider: Redirecting to success URL:', successUrl);
                  window.location.href = successUrl;
                } else {
                  console.error('PaddleProvider: Transaction verification failed:', response.data.message);
                  // Still redirect to success page with transaction ID
                  const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?t=${Date.now()}&transaction_id=${encodeURIComponent(transactionId)}&cardbrand=${encodeURIComponent(cardBrand)}&cardlastfour=${encodeURIComponent(cardLastFour)}`;
                  console.log('PaddleProvider: Redirecting to success URL (verification failed):', successUrl);
                  window.location.href = successUrl;
                }
              } catch (error) {
                console.error('PaddleProvider: Error verifying transaction:', error);
                // Still redirect to success page with transaction ID
                const successUrl = `${import.meta.env.VITE_APP_URL}/payment-success?t=${Date.now()}&transaction_id=${encodeURIComponent(transactionId)}&cardbrand=${encodeURIComponent(cardBrand)}&cardlastfour=${encodeURIComponent(cardLastFour)}`;
                console.log('PaddleProvider: Redirecting to success URL (error):', successUrl);
                window.location.href = successUrl;
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
      
      window.Paddle.Checkout.open({
        items: [{
          priceId: priceId,
          quantity: 1,
        }],
        settings: {
          theme: 'light',
          displayMode: 'overlay',
          locale: 'en',
          successUrl: `${import.meta.env.VITE_APP_URL}/payment-success?t=${Date.now()}&transaction_id=${encodeURIComponent(localStorage.getItem('transactionId') || '')}&cardbrand=${encodeURIComponent(localStorage.getItem('cardBrand') || '')}&cardlastfour=${encodeURIComponent(localStorage.getItem('cardLastFour') || '')}`,
          closeCallback: function() {
            console.log('PaddleProvider: Checkout closed');
          }
        },
        customData: userData ? {
          user_id: userData.id
        } : undefined,
        customer: userData ? {
          email: userData.email
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