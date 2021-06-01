import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Steps, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {ERC20TokenContract} from '@0x/contract-wrappers';
import {getProvider, getWeb3, getWeb3Wrapper} from 'services/web3modal';
import BigNumber from 'bignumber.js';
import {ethers} from 'ethers';
import {getGasEstimationInfoAsync} from 'services/gasPriceEstimation';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {useStyles} from './index.style';
import {Typography} from '@material-ui/core';

interface Props {
  step: Steps | undefined;
  token: Token;
  amount: BigNumber;
  allowanceTarget: string;
  account: string;
  chainId: ChainId;
  loading: boolean;
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

const ApproveStep: React.FC<Props> = (props) => {
  const {
    step,
    token,
    amount,
    allowanceTarget,
    chainId,
    account,
    loading,
    onClose,
    onNext,
    onLoading,
  } = props;

  const {getContractWrappers} = useContractWrapper();

  const isApprove = async () => {
    console.log('Verificando');

    if (token.symbol == 'ETH' || token.symbol == 'WETH') {
      console.log('É ETH, pular para o próximo step');
      return true;
    }

    const contractWrappers = await getContractWrappers(chainId);
    const erc20Token = new ERC20TokenContract(
      token.address,
      contractWrappers?.getProvider() ?? getProvider(),
    );
    const allowance = await erc20Token
      .allowance(account, allowanceTarget)
      .callAsync();
    const isApproved = allowance.isGreaterThan(amount);
    console.log('allowance:', allowance.toString());
    console.log('amount:', amount.toString());
    console.log('token:', token);
    console.log('isApproved', isApproved);
    return isApproved;
  };

  const classes = useStyles();

  useEffect(() => {
    if (step === Steps.APPROVE) {
      console.log('START APPROVE');

      isApprove()
        .then((value) => {
          if (value) {
            console.log('Passa para proximo passo step');
            onNext(true);
          } else {
            console.log('Fica para aprovar');
            onLoading(false);
          }
        })
        .catch((e) => onNext(false, e));
    }
  }, [step]);

  const handleAction = async () => {
    try {
      onLoading(true);

      if (allowanceTarget == null) {
        return Promise.reject('Token address for approval cannot be null or empty');
      }
      if (account == null) {
        return Promise.reject('Account address cannot be null or empty');
      }

      const gasInfo = await getGasEstimationInfoAsync();
      const contractWrappers = getContractWrappers(chainId);
      const web3Wrapper = getWeb3Wrapper()
      const provider = contractWrappers?.getProvider() ?? getProvider();

      if (provider == null || web3Wrapper == null) {
        return Promise.reject('Provider cannot be null');
      }

      console.log('Provider', provider);
      console.log('Token', token);
      console.log('Account', account);
      console.log('AllowanceTarget', allowanceTarget);
      console.log('Amount', amount.toString());
      console.log('GasInfo Estimated Time Ms', gasInfo.estimatedTimeMs.toString());
      console.log('GasInfo Price In Wei', gasInfo.gasPriceInWei.toString());

      const maxApproval = new BigNumber(2).pow(256).minus(1);

      console.log('approve  ',token);

      const erc20Token = new ERC20TokenContract(token.address, provider);
      const tx = await erc20Token.approve(allowanceTarget, maxApproval).sendTransactionAsync({from: account});

      console.log('approve tx', tx);

      web3Wrapper.awaitTransactionSuccessAsync(tx)
      .then(() => onNext(true))
      .catch((e) => onNext(false, e))
    } catch (e) {
      onNext(false, e);
    }
  };

  return (
    <>
      {!loading && (
        <>
          <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
            <Typography style={{fontWeight: 600}} variant='h5' align='center'>
              Approve
            </Typography>
          </DialogTitle>
          <DialogContent dividers></DialogContent>
          <DialogActions>
            <Button color='primary' size='large' onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={handleAction}>
              Approve
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default ApproveStep;
