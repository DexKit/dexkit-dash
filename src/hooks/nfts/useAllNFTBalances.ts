import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useNFTBalances } from './useNFTBalances';

/**
 *
 * Get All NFT balances directly from token list, object is compatible with Bitquery Balance type
 */
export const useALLNFTBalances = (
  account?: string,
) => {
  const nftBalancesMatic = useNFTBalances(account, EthereumNetwork.matic);
  

  return {
      nftBalances: nftBalancesMatic.data,
      loading: nftBalancesMatic.isLoading,
      error: nftBalancesMatic.error,
  }
};
