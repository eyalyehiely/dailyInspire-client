import React, { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    console.log('SubscriptionButton: Button clicked');
    console.log('SubscriptionButton: isPaddleLoaded:', isPaddleLoaded);
    console.log('SubscriptionButton: priceId:', priceId);
    
    setError(null);
    try {
      await openCheckout(priceId);
    } catch (error) {
      console.error('SubscriptionButton: Failed to open checkout:', error);
      setError('Failed to open payment window. Please try again.');
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={!isPaddleLoaded}
        className={`${className} ${!isPaddleLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}; 