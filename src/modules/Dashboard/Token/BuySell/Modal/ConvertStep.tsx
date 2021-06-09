import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BigNumber from 'bignumber.js';
import {Typography} from '@material-ui/core';
import {Steps, Token} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {fromTokenUnitAmount} from '@0x/utils';
// import {useStyles} from './index.style';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {getGasEstimationInfoAsync} from 'services/gasPriceEstimation';
import {useContractWrapper} from 'hooks/useContractWrapper';

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
    onShifting,
  } = props;

  const amountFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

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

      let txHash;

      if (tokenFrom.symbol === 'ETH') {
        txHash = await wethToken.deposit().sendTransactionAsync({
          value: amountFn,
          from: account,
          // gasPrice: gasInfo.gasPriceInWei,
          gasPrice: new BigNumber(selectedGasPrice),
        });
      } else {
        txHash = await wethToken.withdraw(amountFn).sendTransactionAsync({
          from: account,
          // gasPrice: gasInfo.gasPriceInWei,
          gasPrice: new BigNumber(selectedGasPrice),
        });
      }

      console.log('convert tx', txHash);

      web3Wrapper
        .awaitTransactionSuccessAsync(txHash)
        .then(() => onNext(true))
        .catch((e) => onNext(false, e));

      onNext(true);
    } catch (e) {
      onNext(e);
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
