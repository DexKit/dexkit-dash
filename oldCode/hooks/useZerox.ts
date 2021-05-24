import { useEffect } from 'react';
import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { AssetProxyId, APIOrder } from '@0x/types';
import { ZEROX_API_URL } from 'shared/constants/AppConst';
import { useWeb3 } from './useWeb3';

export const useZerox = () => {
  const {chainId} = useWeb3();
  
  let httpClient: HttpClient

  useEffect(() => {
    httpClient = new HttpClient(ZEROX_API_URL(chainId));
  }, [chainId]);


  const getOrdersERC20 = (address: string) => {
    if (httpClient != null) {
      httpClient.getOrdersAsync({
        makerAssetProxyId: AssetProxyId.ERC20,
        takerAssetAddress: address
      }).then(orders => {
        return orders
      }).catch(e => {
        console.log(e);
      })
    }
  }

  return { getOrdersERC20 }
}