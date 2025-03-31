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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      // Set environment first
      window.Paddle.Environment.set('sandbox');
      
      // Then setup with minimal configuration
      window.Paddle.Setup({
        token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
        checkout: {
          theme: 'light',
          locale: 'en',
          successUrl: `${import.meta.env.VITE_APP_URL}/payment-success`,
          closeOnSuccess: true,
        },
      });
      setIsPaddleLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openCheckout = async (priceId: string) => {
    if (!isPaddleLoaded) {
      throw new Error('Paddle is not loaded yet');
    }

    try {
      await window.Paddle.Checkout.open({
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        checkout: {
          theme: 'light',
          locale: 'en',
          successUrl: `${import.meta.env.VITE_APP_URL}/payment-success`,
          closeOnSuccess: true,
        },
      });
    } catch (error) {
      console.error('Error opening checkout:', error);
      throw error;
    }
  };

  return (
    <PaddleContext.Provider value={{ isPaddleLoaded, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
}; 