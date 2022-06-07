import { useWeb3 } from 'hooks/useWeb3';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { RoomType } from '../constants/enums';
import {
  getGameMetadata,
  getGamesMetadata,
  remove,
  signUpdate,
  update,
} from '../services/gameMetadataApi';
import { useIsNFTGame } from './useCoinLeaguesFactory';
import { useLeaguesChainInfo } from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

interface CallbackProps {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string) => void;
  onError?: (error?: any) => void;
}

export const useGameMetadataUpdater = () => {
  const { getProvider, account } = useWeb3();
  const { chainId } = useLeaguesChainInfo();
  const isNFT = useIsNFTGame();
  const chainProvider = getProvider();
  const onPostMetadata = useCallback(
    async (data: any, id: string, callbacks?: CallbackProps) => {
      if (!chainId || !account) {
        return;
      }
      try {
        const signedData = await signUpdate(chainProvider, chainId);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit();
        }
        const response = await update(
          signedData.sig,
          signedData.messageSigned,
          data,
          isNFT ? RoomType.NFT : RoomType.Main,
          id,
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
    [chainProvider, chainId, isNFT, account],
  );

  return { onPostMetadata };
};

export const useGameMetadataDeleteCallback = () => {
  const { getProvider, chainId, account } = useWeb3();
  const isNFT = useIsNFTGame();
  const chainProvider = getProvider();
  const onDeleteGameMetadata = useCallback(
    async (data: any, id: string, callbacks?: CallbackProps) => {
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
          data,
          isNFT ? RoomType.NFT : RoomType.Main,
          id,
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
    [chainProvider, chainId, isNFT, account],
  );

  return { onDeleteGameMetadata };
};

export const useGameMetadata = (id: string) => {
  const isNFT = useIsNFTGame();
  const { chainId } = useLeaguesChainInfo();
  return useQuery(['GET_GAME_METADATA', id, chainId], () => {
    return getGameMetadata(id, isNFT ? RoomType.NFT : RoomType.Main, chainId);
  });
};

export const useGamesMetadata = (ids?: string) => {
  const isNFT = useIsNFTGame();
  const { chainId } = useLeaguesChainInfo();
  return useQuery(['GET_GAMES_METADATA', ids, chainId], () => {
    if (!ids) {
      return;
    }
    return getGamesMetadata(ids, isNFT ? RoomType.NFT : RoomType.Main, chainId);
  });
};
