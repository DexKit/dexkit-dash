import { useWeb3 } from "hooks/useWeb3"
import { useCallback } from "react"
import { useQuery } from "react-query";
import { RoomType } from "../constants/enums";
import { getGameMetadata, getGamesMetadata, signUpdate, update } from "../services/gameMetadataApi";
import { useIsNFTGame } from "./useCoinLeaguesFactory";

interface CallbackProps {
    onSubmit?: (hash?: string) => void;
    onConfirmation?: (hash?: string) => void;
    onError?: (error?: any) => void;
}

export const useGameMetadataUpdater = () => {
    const { getProvider, chainId, account } = useWeb3();
    const isNFT = useIsNFTGame();
    const chainProvider = getProvider();
    const onPostMetadata = useCallback(async (data: any, id: string, callbacks?: CallbackProps) => {
        if (!chainId || !account) {
            return;
        }
        try {
            const signedData = await signUpdate(chainProvider, chainId);
            if (callbacks?.onSubmit) {
                callbacks?.onSubmit();
            }
            const response = await update(signedData.sig, signedData.messageSigned, data, isNFT ? RoomType.NFT : RoomType.Main, id, account)

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
            console.log(e);
            if (callbacks?.onError) {
                callbacks?.onError(e);
            }
        }





    }, [chainProvider, chainId, isNFT, account])

    return { onPostMetadata }
}

export const useGameMetadata = (id: string) => {
    const isNFT = useIsNFTGame();
    return useQuery(['GET_GAME_METADATA', id], () => {
        return getGameMetadata(id, isNFT ? RoomType.NFT : RoomType.Main)
    })
}

export const useGamesMetadata = (ids: string) => {
    const isNFT = useIsNFTGame();
    return useQuery(['GET_GAMES_METADATA', ids], () => {
        return getGamesMetadata(ids, isNFT ? RoomType.NFT : RoomType.Main)
    })
}