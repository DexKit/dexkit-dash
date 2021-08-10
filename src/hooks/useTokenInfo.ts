import { useEffect, useState } from "react";
import { client } from "services/graphql";
import { SEARCH_CURRENCY_BY_ADDRESS } from "services/graphql/bitquery/gql";
import { SearchCurrencyByAddress, SearchCurrencyByAddressVariables } from "services/graphql/bitquery/__generated__/SearchCurrencyByAddress";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { Token } from "types/app";
import { findTokensInfoByAddress,  GET_NATIVE_COINS, isNativeCoinWithoutChainId } from "utils";
import Web3 from "web3";
import { useTokenList } from "./useTokenList";

export const useTokenInfo = (address: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<Token>();
  const tokenListEth = useTokenList(EthereumNetwork.ethereum);
  const tokenListBsc = useTokenList(EthereumNetwork.bsc);

  const searchByAddress = (value: string) => {
    return client.query<
      SearchCurrencyByAddress,
      SearchCurrencyByAddressVariables
    >({
      query: SEARCH_CURRENCY_BY_ADDRESS,
      variables: {
        value: value,
      },
    });
  };

  useEffect(() => {
    if (
      address &&
      Web3.utils.isAddress(address) &&
      tokenListEth.length &&
      tokenListBsc.length
    ) {
      setLoading(true);
      const tk = findTokensInfoByAddress(
        tokenListEth.concat(tokenListBsc),
        address,
      );
      if (tk) {
        setTokenInfo(tk);
        setLoading(false);
        return;
      }

      searchByAddress(address)
        .then((result: any) => {
          if (!result.loading && result?.data) {
            const founds = result?.data?.search;
            const parsedFounds = founds
              ?.filter((f: any) => f.subject.currencyAddress)
              .map((f: any) => {
                return {
                  ...f.subject,
                  address: f.subject.currencyAddress,
                  networkName: f.network.network as EthereumNetwork,
                };
              });

            if (founds.length) {
              setTokenInfo(parsedFounds[0]);
            }
          } else if (
            !result.loading &&
            result?.errors != null &&
            result?.errors.length > 0
          ) {
            console.error('search errors', result.errors);
          }
        })
        .catch((error: any) => console.error('search', error))
        .finally(() => setLoading(false));
    }

    if (isNativeCoinWithoutChainId(address)) {
      const tk = GET_NATIVE_COINS().find(
        (c) => c.symbol.toLowerCase() === address.toLowerCase(),
      );
      if (tk) {
        setTokenInfo(tk);
        return;
      }
    }
  }, [address, tokenListEth, tokenListBsc]);

  return {tokenInfo, loading};
};
