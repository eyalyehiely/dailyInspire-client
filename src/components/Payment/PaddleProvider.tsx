import React, { createContext, useContext, useEffect, useState } from 'react';

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
    // Use the correct script URL from environment variables
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

    // Add script to head instead of body
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
        eventCallback: function(data: any) {
          console.log('PaddleProvider: Paddle event:', data);
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
      console.log('PaddleProvider: Opening checkout...');
      console.log('PaddleProvider: Using product ID:', import.meta.env.VITE_PADDLE_PRODUCT_ID);
      
      window.Paddle.Checkout.open({
        items: [{
          priceId: priceId,
          quantity: 1
        }],
        settings: {
          theme: 'light',
          displayMode: 'inline',
          locale: 'en',
          successUrl: `${import.meta.env.VITE_APP_URL}/payment-success`,
          closeCallback: function() {
            console.log('PaddleProvider: Checkout closed');
          }
        }
      });
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