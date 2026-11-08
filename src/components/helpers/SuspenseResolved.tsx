import { useEffect } from 'react';

interface Props {
  onResolved: () => void;
}

// Fires once its enclosing Suspense boundary has resolved and committed
export const SuspenseResolved = ({ onResolved }: Props) => {
  useEffect(() => {
    onResolved();
  }, [onResolved]);

  return null;
};
