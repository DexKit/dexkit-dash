import {Token} from 'types/app';
import {useWeb3} from './useWeb3';
import {createSignedOrder} from 'services/orders';
import {ZRX_API_URL} from 'shared/constants/AppConst';

export const useZrx = () => {
  const {chainId, account} = useWeb3();

  const createOrder = async (
    token0: Token,
    token1: Token,
    amount: number,
    price: number,
    expiry: number,
    affiliateAddress: string,
  ) => {
    return new Promise((resolve, reject) => {
      if (chainId && account) {
        const order = createSignedOrder(
          {
            baseToken: token0,
            quoteToken: token1,
            amount: amount,
            price: price,
            orderSecondsExpirationTime: expiry,
            affiliateAddress: affiliateAddress,
          },
          chainId,
          account,
        )
          .then((order) => {
            fetch(`${ZRX_API_URL(chainId)}/sra/v4/order`, {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(order),
            })
              .then((response) => {
                if (response) {
                  response.text().then((text: any) => {
                    resolve(text ? JSON.parse(text) : {});
                  });
                } else {
                  reject('Undefined Response');
                }
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => reject(error));
      } else {
        reject('Undefined ChainId or Account');
      }
    });
  };

  return {createOrder};
};

export default useZrx;
