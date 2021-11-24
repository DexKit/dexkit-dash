import {useWeb3} from 'hooks/useWeb3';
import {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {
  setDefaultKittyOnChain,
  clearOldState,
  updateImage,
} from 'redux/_kittygotchi/actions';
import {Kittygotchi} from 'types/kittygotchi';

export function useProfilePoints() {
  /* eslint-disable */
  const [amount, setAmount] = useState(100);
  /* eslint-disable */
  const [maxAmount, setMaxAmount] = useState(500);
  /* eslint-disable */
  const [loading, setLoading] = useState(false);
  /* eslint-disable */
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
      if (account && chainId && kittygotchiState.kittygotchiByChain) {
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
      if (kittygotchiState?.kittygotchiByChain) {
        return kittygotchiState.kittygotchiByChain[`${address}-${chainId}`];
      }
    },
    [kittygotchiState.kittygotchiByChain],
  );

  const updateKittygotchiImage = useCallback(
    (url: string, address: string, chainId: number) => {
      if (kittygotchiState?.kittygotchiByChain) {
        dispatch(updateImage({url, chainId, address}));
      }
    },
    [],
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
    updateKittygotchiImage,
    kittygotchi: kittygotchiState.kittygotchi,
    isDefault,
  };
}
