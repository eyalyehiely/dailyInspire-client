import React from 'react';
import { usePaddle } from './PaddleProvider';

interface SubscriptionButtonProps {
  priceId: string;
  className?: string;
  children: React.ReactNode;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  priceId,
  className = '',
  children,
}) => {
  const { openCheckout, isPaddleLoaded } = usePaddle();

  const handleClick = async () => {
    try {
      await openCheckout(priceId);
    } catch (error) {
      console.error('Failed to open checkout:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isPaddleLoaded}
      className={`${className} ${!isPaddleLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}; 