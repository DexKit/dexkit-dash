import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {Steps, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {ERC20TokenContract} from '@0x/contract-wrappers';
import {getProvider, getWeb3, getWeb3Wrapper} from 'services/web3modal';
import BigNumber from 'bignumber.js';
import {ethers} from 'ethers';
import {getGasEstimationInfoAsync} from 'services/gasPriceEstimation';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {Typography} from '@material-ui/core';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {NotificationType} from 'services/notification';
// import {useStyles} from './index.style';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {truncateAddress} from 'utils';

interface Props {
  step: Steps | undefined;
  tokenFrom: Token;
  amountFrom: number;
  allowanceTarget: string;
  account: string;
  chainId: ChainId;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onShifting: (step: Steps) => void;
}

const ApproveStep: React.FC<Props> = (props) => {
  const {
    step,
    tokenFrom,
    amountFrom,
    allowanceTarget,
    chainId,
    account,
    onNext,
    onLoading,
    onShifting,
  } = props;

  // const classes = useStyles();
  const dispatch = useDispatch();
  const {getContractWrappers} = useContractWrapper();

  const amountFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  const isApprove = async () => {


    if (tokenFrom.symbol.toUpperCase() === 'ETH') {
      return true;
    }

    const contractWrappers = await getContractWrappers(chainId);
    const erc20Token = new ERC20TokenContract(
      tokenFrom.address,
      contractWrappers?.getProvider() ?? getProvider(),
    );

    const allowance = await erc20Token
      .allowance(account, allowanceTarget)
      .callAsync();
    const isApproved = allowance.isGreaterThan(amountFn);

    return isApproved;
  };

  useEffect(() => {
    if (step === Steps.APPROVE) {
   
      isApprove()
        .then((value) => {
          if (value) {     
            onShifting(step);
          } else {
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
        throw new Error('Token address for approval cannot be null or empty');
      }
      if (account == null) {
        throw new Error('Account address cannot be null or empty');
      }

      const gasInfo = await getGasEstimationInfoAsync();
      const contractWrappers = getContractWrappers(chainId);
      const web3Wrapper = getWeb3Wrapper();
      const provider = contractWrappers?.getProvider() ?? getProvider();

      if (provider == null || web3Wrapper == null) {
        throw new Error('Provider cannot be null');
      }

      const maxApproval = new BigNumber(2).pow(256).minus(1);



      const erc20Token = new ERC20TokenContract(tokenFrom.address, provider);
      const tx = await erc20Token
        .approve(allowanceTarget, maxApproval)
        .sendTransactionAsync({from: account});


      web3Wrapper
        .awaitTransactionSuccessAsync(tx)
        .then(() => {
          const notification: Notification = {
            title: 'Approve',
            body: truncateAddress(tx),
          };

          dispatch(onAddNotification([notification], NotificationType.SUCCESS));

          onNext(true);
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    } catch (e) {
      onNext(false, e.message);
    }
  };

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Would you like to approve {tokenFrom.symbol.toUpperCase()}?
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        Approve
      </Button>
    </>
  );
};

export default ApproveStep;
