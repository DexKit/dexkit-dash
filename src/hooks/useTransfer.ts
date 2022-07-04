import { getContractToken } from 'services/transfer-token';
import { fromTokenUnitAmount } from '@0x/utils';
import { Currency } from 'types/myApps';

import { isNativeCoinV2, truncateIsAddress } from 'utils';
import { ChainId } from 'types/blockchain';
import { useWeb3 } from './useWeb3';

import { useAppNetworks, useCustomNetworkList } from 'hooks/network';
import { useNotifications } from './useNotifications';
import { getTransactionScannerUrl, getTransactionScannerUrlV2 } from 'utils/blockchain';
import { NotificationType, TxNotificationMetadata } from 'types/notifications';
import { useIntl } from 'react-intl';

export enum Web3Status {
  Not_Connected,
  Connecting,
  Connected,
  Failure,
}

export const useTransfer = () => {
  const { chainId, getWeb3 } = useWeb3();
  const { messages } = useIntl();

  const { networks } = useCustomNetworkList();
  const appNetworks = useAppNetworks();
  const { createNotification } = useNotifications();

  const onTransfer = async (
    from: string,
    to: string,
    amount: string,
    currency: Currency,
  ) => {
    return new Promise<any>((resolve, reject) => {
      const web3: any = getWeb3();

      if (!web3 && !chainId) {
        return null;
      }

      const amountFn = fromTokenUnitAmount(amount, currency.decimals);

      if (
        isNativeCoinV2(
          currency.symbol,
          chainId as ChainId,
          networks.map((n) => ({
            symbol: n.nativeTokenSymbol,
            chainId: n.chainId,
          })),
          appNetworks.map(n => ({ symbol: n.symbol, chainId: n.chainId }))
        )
      ) {
        web3.eth
          .sendTransaction({ from, to, value: amountFn.toString() })
          .once('transactionHash', (hash: string) => {
            createNotification({
              title: `Transfer ${currency.symbol.toUpperCase()}`,
              body: `Transferred ${amount} ${currency.symbol.toUpperCase()} to ${truncateIsAddress(
                to,
              )}`,
              timestamp: Date.now(),
              url: getTransactionScannerUrlV2(chainId as ChainId, hash,
                appNetworks.map(n => ({ explorerUrl: n.explorerURL, chainId: n.chainId })).concat(networks.map(n => ({ explorerUrl: n.explorerUrl, chainId: n.chainId })))
              ),
              urlCaption: messages['app.dashboard.viewTransaction'] as string,
              type: NotificationType.TRANSACTION,
              metadata: {
                chainId: chainId,
                transactionHash: hash,
                status: 'pending',
              } as TxNotificationMetadata,
            });
            resolve(hash);
          })
          .catch((error: Error) => {
            reject(error.message);
          });
      } else {
        const contract = getContractToken(currency.address, web3);

        contract.methods
          .transfer(to, amountFn.toString())
          .send({ from: from })
          .once('transactionHash', (hash: string) => {
            createNotification({
              title: `Transfer ${currency.symbol.toUpperCase()}`,
              body: `Transferred ${amount} ${currency.symbol.toUpperCase()} to ${truncateIsAddress(
                to,
              )}`,
              timestamp: Date.now(),
              url: getTransactionScannerUrl(chainId as ChainId, hash),
              urlCaption: messages['app.dashboard.viewTransaction'] as string,
              type: NotificationType.TRANSACTION,
              metadata: {
                chainId: chainId,
                transactionHash: hash,
                status: 'pending',
              } as TxNotificationMetadata,
            });

            resolve(hash);
          })
          .catch((error: any) => {
            reject(error.message);
          });
      }
    });
  };

  return { onTransfer };
};
