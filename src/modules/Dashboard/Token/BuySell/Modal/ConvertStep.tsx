import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import BigNumber from 'bignumber.js';
import {Typography} from '@material-ui/core';
import {Steps, Token} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

// import {useStyles} from './index.style';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {truncateAddress} from 'utils';
import {NotificationType} from 'services/notification';

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
    networkName,
    balances,
    selectedGasPrice,
    onNext,
    onLoading,
    onRequestConfirmed,
    onShifting,
  } = props;

  // amountFrom is already set to BigNumber
  // const amountFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  const dispatch = useDispatch();

  const {getContractWrappers} = useContractWrapper();

  const isConverted = () => {
    // let mainBalance;
    // let wrapperBalance;

    // if (networkName == EthereumNetwork.ethereum) {
    //   mainBalance = balances.find(e => e.currency?.symbol == 'ETH');
    //   wrapperBalance = balances.find(e => e.currency?.symbol == 'WETH');
    // } else if (networkName == EthereumNetwork.bsc) {
    //   mainBalance = balances.find(e => e.currency?.symbol == 'BNB');
    //   wrapperBalance = balances.find(e => e.currency?.symbol == 'WBNB');
    // }

    return false;
  };

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

      if (account == null) {
        throw new Error('Account address cannot be null or empty');
      }

      // const gasInfo = await getGasEstimationInfoAsync();
      const contractWrappers = getContractWrappers(chainId);
      const web3Wrapper = getWeb3Wrapper();
      const provider = contractWrappers?.getProvider() ?? getProvider();

      if (provider == null || web3Wrapper == null) {
        throw new Error('Connect your wallet');
      } else if (contractWrappers == null) {
        throw new Error('Contract Error');
      }

      const wethToken = contractWrappers.weth9;

      let txHash: string = '';

      if (tokenFrom.symbol.toUpperCase() === 'ETH') {
        await wethToken
          .deposit()
          .sendTransactionAsync({
            value: amountFrom,
            from: account,
            // gasPrice: gasInfo.gasPriceInWei,
            gasPrice: new BigNumber(selectedGasPrice),
          })
          .then((e) => (txHash = e))
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
          .then((e) => (txHash = e))
          .catch((e) => {
            throw new Error(e.message);
          });
      }


      if (txHash) {
        web3Wrapper
          .awaitTransactionSuccessAsync(txHash)
          .then(() => {
            const notification: Notification = {
              title: 'Convert',
              body: truncateAddress(txHash),
            };

            dispatch(
              onAddNotification([notification], NotificationType.SUCCESS),
            );

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

  const to = tokenFrom.symbol === 'ETH' ? 'WETH' : 'ETH';

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Would you like to convert {tokenFrom.symbol} to {to}?
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        Convert
      </Button>
    </>
  );
};

export default ConvertStep;
