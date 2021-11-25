import React, {useEffect, useCallback} from 'react';
import Button from '@material-ui/core/Button';
import {Steps, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {ethers} from 'ethers';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {Typography} from '@material-ui/core';
import {fromTokenUnitAmount, BigNumber} from '@0x/utils';

import {getERC20Contract} from 'utils/ethers';
import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

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

  const {getContractWrappers} = useContractWrapper();
  const {createNotification} = useNotifications();
  const amountFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  /* eslint-disable */
  const isApprove = useCallback(async () => {
    if (tokenFrom.symbol.toUpperCase() === GET_CHAIN_NATIVE_COIN(chainId)) {
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
  }, [tokenFrom, chainId, getProvider]);

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

      createNotification({
        title: 'Approve',
        body: `Approve ${tokenFrom.symbol.toUpperCase()} to Trade`,
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId, tx.hash),
        urlCaption: 'View transaction',
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: tx.hash,
          status: 'pending',
        } as TxNotificationMetadata,
      });

      web3Wrapper
        .awaitTransactionSuccessAsync(tx.hash)
        .then(() => {
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
