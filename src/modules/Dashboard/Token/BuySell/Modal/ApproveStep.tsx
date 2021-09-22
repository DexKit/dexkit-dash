import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {Steps, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {ethers} from 'ethers';
import {getGasEstimationInfoAsync} from 'services/gasPriceEstimation';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {Typography} from '@material-ui/core';
import {fromTokenUnitAmount, BigNumber} from '@0x/utils';
import {NotificationType} from 'services/notification';
// import {useStyles} from './index.style';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {truncateAddress} from 'utils';
import {getERC20Contract} from 'utils/ethers';
import { GET_CHAIN_NATIVE_COIN } from 'shared/constants/Blockchain';


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
    if (
      tokenFrom.symbol.toUpperCase() === GET_CHAIN_NATIVE_COIN(chainId)
    ) {
      return true;
    }

    const contractWrappers = await getContractWrappers(chainId);

    const ethersProviders = new ethers.providers.Web3Provider(
      contractWrappers?.getProvider() ?? getProvider(),
      chainId,
    );

    const etherERC20Contract = getERC20Contract(
      tokenFrom.address,
      ethersProviders,
      account,
    );
    const allowance = await etherERC20Contract.allowance(
      account,
      allowanceTarget,
    );

    const isApproved = new BigNumber(allowance.toString()).isGreaterThan(
      amountFn,
    );

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

      if (!allowanceTarget) {
        throw new Error('Token address for approval cannot be null or empty');
      }
      if (!account) {
        throw new Error('Account address cannot be null or empty');
      }

      const gasInfo = await getGasEstimationInfoAsync();
      const contractWrappers = getContractWrappers(chainId);
      const web3Wrapper = getWeb3Wrapper();
      const provider = contractWrappers?.getProvider() ?? getProvider();

      if (!provider || !web3Wrapper) {
        throw new Error('Provider cannot be null');
      }

      const maxApproval = new BigNumber(2).pow(256).minus(1);
      const ethersProviders = new ethers.providers.Web3Provider(
        contractWrappers?.getProvider() ?? getProvider(),
        chainId,
      );

      const etherERC20Contract = getERC20Contract(
        tokenFrom.address,
        ethersProviders,
        account,
      );
      const tx = await etherERC20Contract.approve(
        allowanceTarget,
        maxApproval.toString(),
      );

      web3Wrapper
        .awaitTransactionSuccessAsync(tx.hash)
        .then(() => {
          const notification: Notification = {
            title: 'Approve',
            body: truncateAddress(tx.hash),
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
