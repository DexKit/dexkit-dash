import React, {useContext, useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Dialog} from '@material-ui/core';
import {Steps, Token} from 'types/app';
import OrderContent from './OrderContent';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {
  getNativeCoinWrappedAddressFromNetworkName,
  getNativeCoinWrappedFromNetworkName,
} from 'utils';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {AppContext} from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';

interface OrderProps {
  open: boolean;
  isMarket: boolean;
  networkName: EthereumNetwork;
  balances: GetMyBalance_ethereum_address_balances[];
  account: string;
  allowanceTarget: string;
  tokenFrom: Token;
  tokenTo: Token;
  amountFrom: number;
  amountTo: number;
  price: number;
  expiry: number;
  onClose: () => void;
}

const OrderDialog: React.FC<OrderProps> = (props) => {
  const {
    open,
    isMarket,
    balances,
    allowanceTarget,
    tokenFrom,
    tokenTo,
    networkName,
    amountFrom,
    amountTo,
    price,
    expiry,
    onClose,
  } = props;

  const {chainId, account} = useWeb3();

  const [steps, setSteps] = useState<Steps[]>([]);
  const [currentStep, setCurrentStep] = useState<Steps>();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | string>();
  const [isRequestConfirmed, setIsRequestConfirmed] = useState(false);

  const [isConvert, setIsConvert] = useState<boolean>(false);
  const [tokenWrapper, setTokenWrapper] = useState<Token>({
    address: '',
    decimals: 0,
    name: '',
    symbol: '',
  });

  const {theme} = useContext<AppContextPropsType>(AppContext);

  useEffect(() => {
    if (open && tokenFrom && tokenTo && networkName && chainId) {
      setLoading(true);
      let stepsFn: Steps[] = [];

      setTokenWrapper({
        address: getNativeCoinWrappedAddressFromNetworkName(networkName),
        decimals: 18,
        name: '',
        symbol: getNativeCoinWrappedFromNetworkName(networkName).toUpperCase(),
      });

      if (
        (((tokenFrom.symbol.toUpperCase() === 'ETH' &&
          tokenTo.symbol.toUpperCase() === 'WETH') ||
          (tokenFrom.symbol.toUpperCase() === 'WETH' &&
            tokenTo.symbol.toUpperCase() === 'ETH')) &&
          networkName === EthereumNetwork.ethereum) ||
        (((tokenFrom.symbol.toUpperCase() === 'BNB' &&
          tokenTo.symbol.toUpperCase() === 'WBNB') ||
          (tokenFrom.symbol.toUpperCase() === 'WBNB' &&
            tokenTo.symbol.toUpperCase() === 'BNB')) &&
          networkName === EthereumNetwork.bsc)
      ) {
        setIsConvert(true);
        stepsFn = [Steps.APPROVE, Steps.CONVERT];
      } else if (isMarket) {
        setIsConvert(false);
        stepsFn = [Steps.APPROVE, Steps.MARKET];
      } else {
        setIsConvert(false);
        // if (
        //   ((tokenFrom.symbol == 'ETH' || tokenFrom.symbol == 'WETH') && networkName == EthereumNetwork.ethereum) ||
        //   ((tokenFrom.symbol == 'BNB' || tokenFrom.symbol == 'WBNB') && networkName == EthereumNetwork.bsc)
        // ) {
        //   stepsFn = [Steps.APPROVE, Steps.CONVERT, Steps.LIMIT];
        // } else {
        //   stepsFn = [Steps.APPROVE, Steps.LIMIT];
        // }
        stepsFn = [Steps.APPROVE, Steps.LIMIT];
      }

      setSteps(stepsFn);
      setCurrentStep(stepsFn[0]);
      setCurrentStepIndex(-1);
      setIsRequestConfirmed(false);
    }
  }, [open, tokenFrom, tokenTo, networkName, chainId]);

  // Problem: there is a delay after Approve to get the new allowance
  // Fix: wait X seconds before going to the next step
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleNextWithDelay = async () => {
    if (currentStep === Steps.APPROVE) {
      await delay(10000);
    }

    const nextStepIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextStepIndex);

    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
    } else {
      setCurrentStep(Steps.DONE);
    }

    setLoading(false);
  };

  const handleNext = (hasNext: boolean, errorMesage?: Error | string) => {
    if (hasNext) {
      handleNextWithDelay();
    } else {
      setError(errorMesage);
      setCurrentStep(Steps.ERROR);
      setLoading(false);
    }
  };

  const handleLoading = (value: boolean) => {
    if (loading && currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }

    setLoading(value);
  };

  const handleRequestConfirmed = (value: boolean) => {
    setIsRequestConfirmed(value);
  };

  const handleShift = (step: Steps) => {
    const tempSteps = [...steps];

    tempSteps.shift();

    setSteps(tempSteps);
    setCurrentStep(tempSteps[0]);
    setCurrentStepIndex(-1);
    setLoading(true);
  };

  const isfullScreen = window.innerWidth <= 500;

  return (
    <>
      {account && chainId && (
        <Dialog
          fullScreen={isfullScreen}
          fullWidth
          maxWidth='sm'
          scroll='paper'
          open={open}
          onClose={onClose}
          aria-labelledby='form-dialog-title'>
          <OrderContent
            isMarket={isMarket}
            networkName={networkName}
            isConvert={isConvert}
            balances={balances}
            steps={steps}
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            tokenWrapper={tokenWrapper}
            tokenFrom={tokenFrom}
            tokenTo={tokenTo}
            amountFrom={amountFrom}
            allowanceTarget={allowanceTarget}
            price={price}
            expiry={expiry}
            account={account}
            chainId={chainId}
            loading={loading}
            isRequestConfirmed={isRequestConfirmed}
            error={error}
            onClose={onClose}
            onNext={handleNext}
            onLoading={handleLoading}
            onRequestConfirmed={handleRequestConfirmed}
            onShifting={handleShift}
          />
        </Dialog>
      )}
    </>
  );
};

export default OrderDialog;
