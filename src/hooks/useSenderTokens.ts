import { useMemo} from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {
  BINANCE_SYMBOL_URL,
  ETH_SYMBOL_URL,
  MATIC_SYMBOL_URL,
} from 'shared/constants/Coins';
import {Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {getNetworkChainId} from 'utils/blockchain';
import {useAllBalance} from './balance/useAllBalance';
import {useDefaultAccount} from './useDefaultAccount';
import {useTokenList} from './useTokenList';

export function useSenderTokens() {
  const account = useDefaultAccount();
  const tokensETH = useTokenList(EthereumNetwork.ethereum);
  const tokensBSC = useTokenList(EthereumNetwork.bsc);
  const tokensMATIC = useTokenList(EthereumNetwork.matic);
  const {data: balances} = useAllBalance(account);
  const tokens = useMemo(() => {
    return balances.map((e) => {
      // Add images from token list
      let tokenLogoUri;
      if (e.network === EthereumNetwork.ethereum && tokensETH.length > 0) {
        if (e?.currency?.symbol.toLowerCase() === 'eth') {
          tokenLogoUri = ETH_SYMBOL_URL;
        } else {
          const token = tokensETH.find(
            (t: any) =>
              t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
          );
          if (token) {
            tokenLogoUri = token.logoURI;
          }
        }
      }
      if (e.network === EthereumNetwork.bsc && tokensBSC.length > 0) {
        if (e?.currency?.symbol.toLowerCase() === 'bnb') {
          tokenLogoUri = BINANCE_SYMBOL_URL;
        } else {
          const token = tokensBSC.find(
            (t: any) =>
              t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
          );
          if (token) {
            tokenLogoUri = token.logoURI;
          }
        }
      }

      if (e.network === EthereumNetwork.matic && tokensMATIC.length > 0) {
        if (e?.currency?.symbol.toLowerCase() === 'matic') {
          tokenLogoUri = MATIC_SYMBOL_URL;
        } else {
          const token = tokensMATIC.find(
            (t: any) =>
              t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
          );
          if (token) {
            tokenLogoUri = token.logoURI;
          }
        }
      }
      return {
        name: e.currency?.name || '',
        symbol: e.currency?.symbol || '',
        address: e.currency?.address || '',
        decimals: e.currency?.decimals || 18,
        networkName: e.network,
        logoURI: tokenLogoUri,
        icon: tokenLogoUri,
        chainId: getNetworkChainId(e.network) as ChainId,
      } as Token;
    });
  }, [balances, tokensBSC, tokensMATIC, tokensETH]);

  return {tokens};
}
