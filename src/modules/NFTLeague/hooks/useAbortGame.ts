import {useWeb3} from 'hooks/useWeb3';
import {useState, useCallback} from 'react';
import {useMutation} from 'react-query';
import {ChainId} from 'types/blockchain';
import {GET_NFT_LEAGUE_FACTORY_ADDRESS} from '../constants';
import {abortGame} from '../services/battleFactory';

export function useAbortGame(
  chainId?: ChainId,
  onSubmit?: (hash: string) => void,
  onConfirm?: () => void,
) {
  const {getProvider} = useWeb3();

  const [hash, setHash] = useState<string>();

  const [confirmed, setConfirmed] = useState(false);

  const handleMutation = useCallback(
    (id: number) => {
      return abortGame(
        GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
        id,
        getProvider(),
      ).then(async (tx) => {
        setHash(tx.hash);

        if (onSubmit) {
          onSubmit(tx.hash);
        }

        const receipt = await tx.wait();

        if (receipt.confirmations > 0) {
          setConfirmed(true);
          onConfirm!();
        }

        return tx;
      });
    },
    [onSubmit, chainId, getProvider, onConfirm],
  );

  const query = useMutation(handleMutation);

  const reset = useCallback(() => {
    setConfirmed(false);
    setHash(undefined);
    query.reset();
  }, [query]);

  return {...query, hash, confirmed, reset};
}
