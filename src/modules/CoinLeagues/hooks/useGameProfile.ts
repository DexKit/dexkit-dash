import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {useQuery} from 'react-query';
import {
  remove,
  signUpdate,
  create,
  createUsername,
  getProfile,
} from '../services/profileApi';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';

interface CallbackProps {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string) => void;
  onError?: (error?: any) => void;
}

export const useGameProfileUpdater = () => {
  const {getProvider, account} = useWeb3();
  const {chainId} = useLeaguesChainInfo();

  const chainProvider = getProvider();
  const onPostMetadata = useCallback(
    async (
      username: string,
      tokenAddress: string,
      tokenId: string,
      callbacks?: CallbackProps,
    ) => {
      if (!chainId || !account) {
        return;
      }
      try {
        const signedData = await signUpdate(chainProvider, chainId);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit();
        }
        const response = await create(
          signedData.sig,
          signedData.messageSigned,
          tokenAddress,
          tokenId,
          username,
          account,
          chainId,
        );

        if (response.ok && response.status === 200) {
          if (callbacks?.onConfirmation) {
            callbacks?.onConfirmation();
          }
        } else if (response.status === 403) {
          throw new Error('Invalid params');
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [chainProvider, chainId, account],
  );

  const onPostOnlyUsernameMetadata = useCallback(
    async (username: string, callbacks?: CallbackProps) => {
      if (!chainId || !account) {
        return;
      }
      try {
        const signedData = await signUpdate(chainProvider, chainId);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit();
        }
        const response = await createUsername(
          signedData.sig,
          signedData.messageSigned,
          username,
          account,
          chainId,
        );

        if (response.ok && response.status === 200) {
          if (callbacks?.onConfirmation) {
            callbacks?.onConfirmation();
          }
        } else if (response.status === 403) {
          throw new Error('Invalid params');
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [chainProvider, chainId, account],
  );

  return {onPostMetadata, onPostOnlyUsernameMetadata};
};

export const useProfileGameDeleteCallback = () => {
  const {getProvider, chainId, account} = useWeb3();
  const chainProvider = getProvider();
  const onDeleteGameMetadata = useCallback(
    async (callbacks?: CallbackProps) => {
      if (!chainId || !account) {
        return;
      }
      try {
        const signedData = await signUpdate(chainProvider, chainId);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit();
        }
        const response = await remove(
          signedData.sig,
          signedData.messageSigned,
          account,
        );

        if (response.ok && response.status === 200) {
          if (callbacks?.onConfirmation) {
            callbacks?.onConfirmation();
          }
        } else if (response.status === 403) {
          throw new Error('Invalid params');
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [chainProvider, chainId, account],
  );

  return {onDeleteGameMetadata};
};

export const useProfileGame = (account?: string) => {
  return useQuery(['GET_GAME_PROFILE', account], () => {
    if (!account) {
      return undefined;
    }

    return getProfile(account);
  });
};
