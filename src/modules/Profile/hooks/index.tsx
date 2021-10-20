import {useWeb3} from 'hooks/useWeb3';
import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {
  setDefaultKitty,
  setDefaultKittyOnChain,
  clearOldState,
} from 'redux/_kittygotchi/actions';
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

  const {account, chainId} = useWeb3();

  const kittygotchiState = useSelector<AppState, AppState['kittygotchi']>(
    (state) => state.kittygotchi,
  );

  const setDefaultKittygothchi = useCallback(
    (address: string, chainId: number, kittygotchi: Kittygotchi) => {
      dispatch(setDefaultKittyOnChain({address, chainId, kittygotchi}));
    },
    [dispatch],
  );

  const isDefault = useCallback(
    (kittygotchi?: Kittygotchi) => {
      if (account && chainId) {
        return (
          kittygotchiState.kittygotchiByChain[`${account}-${chainId}`]?.id ===
          kittygotchi?.id
        );
      }
      return false;
    },
    [kittygotchiState.kittygotchiByChain, account, chainId],
  );

  const getDefault = useCallback(
    (address: string, chainId: number): Kittygotchi | undefined => {
      if(kittygotchiState?.kittygotchiByChain ){
        return kittygotchiState.kittygotchiByChain[`${address}-${chainId}`];
      }
     
    },
    [kittygotchiState.kittygotchiByChain],
  );

  /**
   * migrate from to onchain based default
   */
  useEffect(() => {
    if (kittygotchiState.kittygotchi) {
      if (account && chainId) {
        setDefaultKittygothchi(account, chainId, kittygotchiState.kittygotchi);
        dispatch(clearOldState());
      }
    }
  }, [chainId, account, kittygotchiState.kittygotchi]);

  return {
    getDefault,
    setDefaultKittygothchi,
    kittygotchi: kittygotchiState.kittygotchi,
    isDefault,
  };
}
