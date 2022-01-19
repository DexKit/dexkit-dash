import React, {useEffect, useCallback} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Button from '@material-ui/core/Button';
import {Steps, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {getProvider, getWeb3Wrapper} from 'services/web3modal';
import {ethers} from 'ethers';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {Typography} from '@material-ui/core';
import {fromTokenUnitAmount, BigNumber} from '@0x/utils';

import {getERC20Contract} from 'utils/ethers';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useChainInfo} from 'hooks/useChainInfo';

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

  const {tokenSymbol, getTransactionScannerUrl} = useChainInfo();

  const {messages} = useIntl();

  const {getContractWrappers} = useContractWrapper();
  const {createNotification} = useNotifications();
  const amountFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  /* eslint-disable */
  const isApprove = useCallback(async () => {
    if (tokenFrom.symbol.toUpperCase() === tokenSymbol) {
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
  }, [tokenFrom, chainId, getProvider, tokenSymbol]);

  useEffect(() => {
    if (step === Steps.APPROVE && tokenSymbol) {
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
  }, [step, tokenSymbol]);

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
        title: messages['app.dashboard.approve'] as string,
        body: `${
          messages['app.dashboard.approve']
        } ${tokenFrom.symbol.toUpperCase()} ${messages['app.dashboard.to']} ${
          messages['app.dashboard.trade']
        }`,
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId, tx.hash),
        urlCaption: messages['app.dashboard.viewTransaction'] as string,
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
        <IntlMessages id='app.dashboard.approve' />
      </Button>
    </>
  );
};

export default ApproveStep;
