import React, {useCallback, useState, useEffect} from 'react';
import {Kittygotchi} from 'types/kittygotchi';

export function useKittygotchi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Kittygotchi>();

  const get = useCallback((id: string) => {
    setData({id: '1', attack: 30, defense: 30, run: 50});
  }, []);

  return {get, loading, error, data};
}

export function useKittygotchiList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Kittygotchi[]>();

  const get = useCallback(() => {
    setData([{id: '1', attack: 20, defense: 20, run: 20}]);
    return;
  }, []);

  return {get, data, loading, error};
}

export function useKittygotchiFeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Kittygotchi[]>();

  const feed = useCallback(() => {
    return;
  }, []);

  return {feed, data, loading, error};
}
