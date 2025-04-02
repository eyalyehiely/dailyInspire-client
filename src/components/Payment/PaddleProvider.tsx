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

  const updateUserSubscription = async (subscriptionId: string, subscriptionStatus: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/payments/update-user-data`,
        {
          subscriptionId,
          subscriptionStatus
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
        eventCallback: async function(data: any) {
          console.log('PaddleProvider: Paddle event received:', {
            event: data.event,
            data: data
          });
          
          // Handle successful payment event
          if (data.event === 'checkout.completed') {
            console.log('PaddleProvider: Checkout completed event received');
            console.log('PaddleProvider: Checkout data:', data);
            
            try {
              // Update user subscription data
              await updateUserSubscription(
                data.data.subscription_id,
                'active'
              );
              
              console.log('PaddleProvider: User subscription updated successfully');
            } catch (error) {
              console.error('PaddleProvider: Error updating user subscription:', error);
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
          user_id: userData._id
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