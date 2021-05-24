import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Steps, Token } from 'types/app';
import { ChainId } from 'types/blockchain';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { getProvider, getWeb3 } from 'services/web3modal';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { getGasEstimationInfoAsync } from 'services/gasPriceEstimation';
import { useContractWrapper } from 'hooks/useContractWrapper';

interface Props {
  step: Steps | undefined;
  token: Token;
  amount: BigNumber;
  allowanceTarget: string;
  account: string,
  chainId: ChainId,
  loading: boolean,
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

const ApproveStep: React.FC<Props> = (props) => {
  const { step, token, amount, allowanceTarget, chainId, account, loading, onClose, onNext, onLoading} = props;

  const {getContractWrappers} = useContractWrapper();

  const isApprove = async () => {
    console.log('Verificando');

    if (token.symbol == 'ETH' || token.symbol == 'WETH') {
      console.log('É ETH, pular para o próximo step');
      return true;
    }

    const contractWrappers = await getContractWrappers(chainId);
    const erc20Token = new ERC20TokenContract(token.address, contractWrappers?.getProvider() ?? getProvider());
    const allowance = await erc20Token.allowance(account, allowanceTarget).callAsync();
    const isApproved = allowance.isGreaterThan(amount);
    console.log('allowance:', allowance.toString());
    console.log('amount:', amount.toString());
    console.log('token:', token);
    console.log('isApproved', isApproved);
    return isApproved;
  }

  useEffect(() => {
    if (step == Steps.APPROVE) {
      console.log('START APPROVE')

      isApprove()
        .then(value => {
          if (value) {
            console.log('Passa para proximo passo step')
            onNext(true);
          } else {
            console.log('Fica para aprovar')
            onLoading(false);
          }
        })
        .catch(e => onNext(false, e))
    }
  }, [step])

  const handleAction = async () => {
    try {
      onLoading(true);
      
      if (allowanceTarget == null){
        return Promise.reject("Token address for approval cannot be null or empty");
      } 
      if (account == null){
        return Promise.reject("Account address cannot be null or empty");
      }

      const gasInfo = await getGasEstimationInfoAsync();
      
      const contractWrappers = getContractWrappers(chainId);
      const provider = contractWrappers?.getProvider();
      
      if (provider == null){
        return Promise.reject("provider cannot be null");
      }
      console.log('provider', provider);
      console.log('token', token);
      console.log('account', account);
      console.log('allowanceTarget', allowanceTarget);
      console.log('amount', amount.toString());
      console.log('gasInfo Estimated Time Ms', gasInfo.estimatedTimeMs.toString());
      console.log('gasInfo Price In Wei', gasInfo.gasPriceInWei.toString());

      const maxApproval = new BigNumber(2).pow(256).minus(1);

      const erc20Token = new ERC20TokenContract(token.address, provider);
      const tx = await erc20Token.approve(allowanceTarget, maxApproval)
        .sendTransactionAsync({
          from: account
        });
      console.log(tx);
      // provider.waitForTransaction()
      onNext(true);
    } catch (e) {
      onNext(false, e);
    }
  }

  return (
    <>
      {!loading && (<>
        <DialogTitle id="form-dialog-title">Approve</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleAction} color="primary">Approve</Button>
        </DialogActions>
      </>)}
    </>
  );
}

export default ApproveStep