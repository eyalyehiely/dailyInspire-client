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
    script.src = 'https://cdn.paddle.com/paddle.js';
    script.async = true;
    script.onload = () => {
      window.Paddle.Setup({
        vendor: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
        eventCallback: function(data: any) {
          console.log('Paddle event:', data);
        }
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
      window.Paddle.Checkout.open({
        product: import.meta.env.VITE_PADDLE_PRODUCT_ID,
        price: priceId,
        successCallback: function(data: any) {
          console.log('Checkout success:', data);
          window.location.href = `${import.meta.env.VITE_APP_URL}/payment-success`;
        },
        closeCallback: function() {
          console.log('Checkout closed');
        }
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