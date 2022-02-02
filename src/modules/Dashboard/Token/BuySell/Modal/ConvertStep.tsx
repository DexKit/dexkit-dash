import React, {useEffect} from 'react';

import {useIntl} from 'react-intl';

import Button from '@material-ui/core/Button';
import {Typography} from '@material-ui/core';
import {Steps, Token} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

// import {useStyles} from './index.style';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {useNotifications} from 'hooks/useNotifications';
import {BigNumber} from '@0x/utils';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {tokenAmountInUnits} from 'utils';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';
import {useChainInfo} from 'hooks/useChainInfo';

// get tokens ta sendo chamado 3x

interface Props {
  step: Steps;
  tokenFrom: Token;
  amountFrom: BigNumber;
  account: string;
  chainId: number;
  networkName: EthereumNetwork;
  balances: GetMyBalance_ethereum_address_balances[];
  selectedGasPrice: string;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onRequestConfirmed: (value: boolean) => void;
  onShifting: (step: Steps) => void;
}

const ConvertStep: React.FC<Props> = (props) => {
  const {
    step,
    tokenFrom,
    amountFrom,
    account,
    chainId,
    selectedGasPrice,
    onNext,
    onLoading,
    onRequestConfirmed,
    onShifting,
  } = props;

  const {tokenSymbol, getTransactionScannerUrl} = useChainInfo();

  const {createNotification} = useNotifications();
  const {getContractWrappers} = useContractWrapper();
  const {messages} = useIntl();

  const isConverted = () => {
    return false;
  };

  /* eslint-disable */
  useEffect(() => {
    if (step === Steps.CONVERT) {
      if (isConverted()) {
        onShifting(step);
      } else {
        onLoading(false);
      }
    }
  }, []);

  const handleAction = async () => {
    try {
      onLoading(true);
      onRequestConfirmed(true);

      if (!account) {
        throw new Error('Account address cannot be null or empty');
      }

      // const gasInfo = await getGasEstimationInfoAsync();
      const contractWrappers = getContractWrappers(chainId);
      const web3Wrapper = getWeb3Wrapper();
      const provider = contractWrappers?.getProvider() ?? getProvider();

      if (!provider || !web3Wrapper) {
        throw new Error('Connect your wallet');
      } else if (!contractWrappers) {
        throw new Error('Contract Error');
      }

      const wethToken = contractWrappers.weth9;

      let txHash = '';

      if (tokenFrom.symbol.toUpperCase() === tokenSymbol) {
        await wethToken
          .deposit()
          .sendTransactionAsync({
            value: amountFrom,
            from: account,
            // gasPrice: gasInfo.gasPriceInWei,
            gasPrice: new BigNumber(selectedGasPrice),
          })
          .then((e) => {
            txHash = e;
            const amountFromUnit = tokenAmountInUnits(amountFrom);
            const amountToUnit = tokenAmountInUnits(amountFrom);

            if (txHash) {
              createNotification({
                title: `${messages['app.dashboard.convert']} ${tokenSymbol} ${messages['app.dashboard.to']} W${tokenSymbol}`,
                body: `${messages['app.dashboard.converted']}  ${amountFromUnit} ${tokenSymbol} ${messages['app.dashboard.to']} ${amountToUnit} W${tokenSymbol}`,
                timestamp: Date.now(),
                url: getTransactionScannerUrl(chainId, txHash),
                urlCaption: messages['app.dashboard.viewTransaction'] as string,
                type: NotificationType.TRANSACTION,
                metadata: {
                  chainId: chainId,
                  transactionHash: txHash,
                  status: 'pending',
                } as TxNotificationMetadata,
              });
            }
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      } else {
        await wethToken
          .withdraw(amountFrom)
          .sendTransactionAsync({
            from: account,
            // gasPrice: gasInfo.gasPriceInWei,
            gasPrice: new BigNumber(selectedGasPrice),
          })
          .then((e) => {
            txHash = e;
            const amountFromUnit = tokenAmountInUnits(amountFrom);
            const amountToUnit = tokenAmountInUnits(amountFrom);
            if (txHash) {
              createNotification({
                title: `${messages['app.dashboard.convert']} W${tokenSymbol} ${messages['app.dashboard.to']} ${tokenSymbol}`,
                body: `${messages['app.dashboard.converted']} ${amountFromUnit}  W${tokenSymbol} ${messages['app.dashboard.to']} ${amountToUnit} ${tokenSymbol}`,
                timestamp: Date.now(),
                url: getTransactionScannerUrl(chainId, txHash),
                urlCaption: messages['app.dashboard.viewTransaction'] as string,
                type: NotificationType.TRANSACTION,
                metadata: {
                  chainId: chainId,
                  transactionHash: txHash,
                  status: 'pending',
                } as TxNotificationMetadata,
              });
            }
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      }

      if (txHash) {
        web3Wrapper
          .awaitTransactionSuccessAsync(txHash)
          .then(() => {
            onNext(true);
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      } else {
        throw new Error('txHash not found');
      }
    } catch (e) {
      onNext(false, e.message);
    }
  };

  const to = tokenFrom.symbol === tokenSymbol ? `W${tokenSymbol}` : tokenSymbol;

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        <IntlMessages id='app.dashboard.wouldLikeToConvert' />{' '}
        {tokenFrom.symbol} <IntlMessages id='app.dashboard.to' /> {to}?
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        <IntlMessages id='app.dashboard.convert' />
      </Button>
    </>
  );
};

export default ConvertStep;
