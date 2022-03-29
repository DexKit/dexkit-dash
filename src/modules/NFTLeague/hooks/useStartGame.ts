import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import {useMutation} from 'react-query';
import {ChainId} from 'types/blockchain';
import {GET_NFT_LEAGUE_FACTORY_ADDRESS} from '../constants';
import {startGame} from '../services/battleFactory';

export function useStartGame(
  chainId?: ChainId,
  onSubmit?: (hash: string) => void,
  onConfirm?: () => void,
) {
  const {getProvider} = useWeb3();

  const [hash, setHash] = useState<string>();

  const [confirmed, setConfirmed] = useState(false);

  const mutationCallback = useCallback(
    (id: number) => {
      return startGame(
        GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
        id,
        getProvider(),
      ).then(async (tx) => {
        if (onSubmit) {
          onSubmit(tx.hash);
        }

        setHash(tx.hash);

        const receipt = await tx.wait();

        if (receipt.confirmations > 0) {
          setConfirmed(true);
          onConfirm!();
        }

        return tx;
      });
    },
    [chainId, onSubmit, getProvider, onConfirm],
  );

  const query = useMutation(mutationCallback);

  const reset = useCallback(() => {
    setConfirmed(false);
    setHash(undefined);
    query.reset();
  }, [query]);

  return {...query, hash, confirmed, reset};
}
