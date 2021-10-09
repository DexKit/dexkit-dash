import React, {useState, useCallback, useEffect} from 'react';

export function useProfilePoints() {
  const [amount, setAmount] = useState(100);
  const [maxAmount, setMaxAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  return {amount, maxAmount, error, loading};
}

export function useKittygotchiMint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const mint = useCallback(() => {}, []);

  return {mint, loading, error};
}
