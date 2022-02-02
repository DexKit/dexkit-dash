import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ChangellyCoin} from 'types/changelly';

//NOTE: Study if it worth use this at the moment
export enum Steps {
  Exchange,
  SetWallet,
  ReviewOrder,
  WaitOrder,
  OrderFinish,
}

export interface SwapContextProps {
  fromCoin?: ChangellyCoin;
  toCoin?: ChangellyCoin;
  coins: ChangellyCoin[];
  step: Steps;
  addressToSend?: string;
  loading: boolean;
  fromLoading: boolean;
  toLoading: boolean;
  fromAmount?: number;
  toAmount?: number;
  minFromAmount: number;
  validAddress: boolean;
  setLoading?: (loading: boolean) => void;
  setToLoading?: (loading: boolean) => void;
  setFromLoading?: (loading: boolean) => void;
  setStep?: (step: Steps) => void;
  setToCoin?: (coin: ChangellyCoin) => void;
  setFromCoin?: (coin: ChangellyCoin) => void;
  setCoins?: (coins: ChangellyCoin[]) => void;
  setFromAmount?: (amount: number) => void;
  setMinFromAmount?: (amount: number) => void;
  setToAmount?: (amount: number) => void;
  setAddressToSend?: (address: string) => void;
  setValidAddress?: (validAddress: boolean) => void;
}

const defaultSwapContext = {
  coins: [],
  step: Steps.Exchange,
  loading: false,
  fromLoading: false,
  toLoading: false,
  minFromAmount: 0,
  validAddress: false,
};

export const SwapContext =
  React.createContext<SwapContextProps>(defaultSwapContext);

const SwapContextProvider: React.FC<React.ReactNode> = ({children}) => {
  const [loading, setLoading] = useState(defaultSwapContext.loading);
  const [toLoading, setToLoading] = useState(defaultSwapContext.toLoading);
  const [step, setStep] = useState(defaultSwapContext.step);
  const [fromLoading, setFromLoading] = useState(false);
  const [coins, setCoins] = useState<ChangellyCoin[]>([]);
  const [fromCoin, setFromCoin] = useState<ChangellyCoin>();
  const [toCoin, setToCoin] = useState<ChangellyCoin>();
  const [fromAmount, setFromAmount] = useState<number>();
  const [minFromAmount, setMinFromAmount] = useState<number>(
    defaultSwapContext.minFromAmount,
  );
  const [toAmount, setToAmount] = useState<number>();
  const [addressToSend, setAddressToSend] = useState<string>();
  const [validAddress, setValidAddress] = useState<boolean>(
    defaultSwapContext.validAddress,
  );

  return (
    <SwapContext.Provider
      value={{
        loading,
        setLoading,
        toLoading,
        setToLoading,
        step,
        setStep,
        fromLoading,
        setFromLoading,
        coins,
        setCoins,
        fromCoin,
        setFromCoin,
        toCoin,
        setToCoin,
        fromAmount,
        setFromAmount,
        minFromAmount,
        setMinFromAmount,
        toAmount,
        setToAmount,
        addressToSend,
        setAddressToSend,
        validAddress,
        setValidAddress,
      }}>
      {children}
    </SwapContext.Provider>
  );
};

SwapContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SwapContextProvider;
