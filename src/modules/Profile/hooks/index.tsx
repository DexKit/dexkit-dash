import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {setDefaultKitty} from 'redux/_kittygotchi/actions';
import {Kittygotchi} from 'types/kittygotchi';

export function useProfilePoints() {
  const [amount, setAmount] = useState(100);
  const [maxAmount, setMaxAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  return {amount, maxAmount, error, loading};
}

export function useProfileKittygotchi() {
  const dispatch = useDispatch();

  const kittygotchiState = useSelector<AppState, AppState['kittygotchi']>(
    (state) => state.kittygotchi,
  );

  const setDefaultKittygothchi = useCallback(
    (kittygotchi: Kittygotchi) => {
      dispatch(setDefaultKitty(kittygotchi));
    },
    [dispatch],
  );

  return {setDefaultKittygothchi, kittygotchi: kittygotchiState.kittygotchi};
}
