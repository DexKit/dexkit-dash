import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Steps, Token} from 'types/app';
import {useWeb3} from 'hooks/useWeb3';
import {getContractWrappers} from 'services/contract_wrappers';
import {ERC20TokenContract} from '@0x/contract-wrappers';
import {getProvider} from 'services/web3modal';
import {ethers} from 'ethers';
import LoadingStep from './LoadingStep';
import ErrorStep from './ErrorStep';
import ApproveStep from './ApproveStep';
import {useBalance} from 'hooks/balance/useBalance';
import BigNumber from 'bignumber.js';
import ConvertStep from './ConvertStep';
import MarketStep from './MarketStep';
import {Box, IconButton, Typography} from '@material-ui/core';
import DoneStep from './DoneStep';
import {useStyles} from './index.style';
import LimitStep from './LimitStep';
import ProgressBar from './PogressBar';

interface OrderProps {
  open: boolean;
  isMarket: boolean;
  amount: BigNumber;
  token0: Token;
  token1: Token;
  account: string;
  allowanceTarget: string;
  price: number;
  onClose: () => void;
}

const OrderDialog: React.FC<OrderProps> = (props) => {
  const {
    open,
    isMarket,
    amount,
    token0,
    token1,
    allowanceTarget,
    price,
    onClose,
  } = props;

  const classes = useStyles();
  const {chainId, account} = useWeb3();
  const {data} = useBalance();

  const [steps, setSteps] = useState<Steps[]>([]);
  const [stepsIdx, setStepsIdx] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<Steps>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | string>();

  useEffect(() => {
    if (open) {
      let stepsFn: Steps[] = [];
      setLoading(true);

      if (isMarket) {
        stepsFn = [Steps.APPROVE, Steps.MARKET];
        setSteps(stepsFn);
        setCurrentStep(stepsFn[0]);
      } else {
        stepsFn = [Steps.APPROVE, Steps.LIMIT];
        setSteps(stepsFn);
        setCurrentStep(stepsFn[0]);
      }

      setStepsIdx(0);
    }
  }, [open]);

  const handleNext = (hasNext: boolean, errorMesage?: Error | string) => {
    if (hasNext) {
      console.log('next is not a error');
      const idx = stepsIdx + 1;
      if (idx < steps.length) {
        console.log('next has next step');
        setStepsIdx(idx);
        setCurrentStep(steps[idx]);
      } else {
        setCurrentStep(Steps.DONE);
        console.log('next done');
      }
    } else {
      console.log('next is an error');
      setError(errorMesage);
      setCurrentStep(Steps.ERROR);
    }
  };

  const handleLoading = (value: boolean) => {
    setLoading(value);
  };

  let step;

  if (account && chainId) {
    if (loading) {
      step = <LoadingStep />;
    } else {
      switch (currentStep) {
        case Steps.APPROVE:
          step = (
            <ApproveStep
              step={currentStep}
              token={token0}
              amount={amount}
              allowanceTarget={allowanceTarget}
              account={account}
              chainId={chainId}
              loading={loading}
              onClose={onClose}
              onNext={handleNext}
              onLoading={handleLoading}
            />
          );
          break;
        case Steps.ERROR:
          step = (
            <ErrorStep
              step={currentStep}
              error={error}
              onClose={onClose}
              onLoading={handleLoading}
            />
          );
          break;
        case Steps.DONE:
          step = (
            <DoneStep
              step={currentStep}
              onClose={onClose}
              onLoading={handleLoading}
            />
          );
          break;
      }
    }
  }

  return (
    <>
      {account && chainId && (
        <Dialog
          fullWidth
          maxWidth='sm'
          open={open}
          onClose={onClose}
          aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>
            <Typography align='right'>
              <IconButton aria-label='close' onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Typography>
            <Typography
              className={classes.textPrimary}
              variant='h5'
              align='center'>
              Review {isMarket ? 'Market' : 'Limit'} Order
            </Typography>
          </DialogTitle>

          {/* {currentStep === Steps.CONVERT && <ConvertStep amount={amount} onClose={handleClose} onNext={handleNext}/>} */}

          {isMarket ? (
            <MarketStep
              step={currentStep}
              token0={token0}
              token1={token1}
              amount={amount}
              account={account}
              chainId={chainId}
              loading={loading}
              onClose={onClose}
              onNext={handleNext}
              onLoading={handleLoading}>
              {step}
              <ProgressBar steps={steps} currentStepIndex={stepsIdx} />
            </MarketStep>
          ) : (
            <LimitStep
              step={currentStep}
              token0={token0}
              token1={token1}
              amount={amount}
              account={account}
              chainId={chainId}
              loading={loading}
              onClose={onClose}
              onNext={handleNext}
              onLoading={handleLoading}>
              {step}
              <ProgressBar steps={steps} currentStepIndex={stepsIdx} />
            </LimitStep>
          )}
        </Dialog>
      )}
    </>
  );
};

export default OrderDialog;
