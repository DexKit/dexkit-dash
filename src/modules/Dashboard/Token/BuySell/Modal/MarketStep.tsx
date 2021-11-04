import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {SwapQuoteResponse} from 'types/zerox';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useNotifications} from 'hooks/useNotifications';
import {Token} from 'types/app';
import {tokenAmountInUnits} from 'utils';
import {BigNumber} from '@0x/utils';

interface Props {
  account: string;
  quote: SwapQuoteResponse;
  tokenFrom: Token;
  tokenTo: Token;
  selectedGasPrice: string;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onRequestConfirmed: (value: boolean) => void;
}

const MarketStep: React.FC<Props> = (props) => {
  const {
    account,
    quote,
    selectedGasPrice,
    onNext,
    onLoading,
    onRequestConfirmed,
    tokenFrom,
    tokenTo,
  } = props;

  const {getWeb3, chainId} = useWeb3();

  const {createNotification} = useNotifications();

  const handleAction = () => {
    onLoading(true);
    onRequestConfirmed(true);

    if (!account) {
      throw new Error('Account address cannot be null or empty');
    }

    const web3 = getWeb3();

    if (!web3 || !chainId) {
      throw new Error('Provider cannot be null');
    }

    web3.eth
      .sendTransaction({
        to: quote.to,
        from: account,
        gasPrice: selectedGasPrice,
        data: quote.data,
        value: quote.value,
      })
      .then((e) => {
        const tokenFromQuantity = tokenAmountInUnits(
          new BigNumber(quote.sellAmount),
          tokenFrom.decimals,
        );
        const tokenToQuantity = tokenAmountInUnits(
          new BigNumber(quote.buyAmount),
          tokenTo.decimals,
        );

        createNotification({
          title: `Market Order`,
          body: `Swap ${tokenFromQuantity} ${tokenFrom.symbol.toUpperCase()} to ${tokenToQuantity} ${tokenTo.symbol.toUpperCase()}`,
          timestamp: Date.now(),
          url: getTransactionScannerUrl(chainId, e.transactionHash),
          urlCaption: 'View transaction',
          type: NotificationType.TRANSACTION,
          metadata: {
            chainId: chainId,
            transactionHash: e.transactionHash,
            status: 'done',
          } as TxNotificationMetadata,
        });
        onNext(true);
      })
      .catch((e) => {
        onNext(false, e.message);
      })
      .finally(() => {
        onLoading(false);
      });
  };

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Would you like to confirm your market order?
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        Confirm
      </Button>
    </>
  );
};

export default MarketStep;
