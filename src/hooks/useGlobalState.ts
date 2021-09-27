import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {ProviderWrapper} from 'types/ProviderWrapper';

import {getProvider as getWeb3Provider} from 'services/web3modal';
import {isMagicProvider} from 'services/magic';
import EventEmitter from 'events';
import {useWeb3} from './useWeb3';
import {Web3State} from 'types/blockchain';

export interface GlobalState {
  showTransactionModal: boolean;
  handleShowTransactionModal: () => void;
  handleCloseTransactionModal: () => void;
  handleTransactionConfirm?: (data: any) => void;
  handleTransactionCancel?: () => void;
  handleChangeWeb3State: (web3State: Web3State) => void;
  data?: any;
  getProvider(): any;
}

type Callback = (
  resolve: (result: any) => void,
  reject: (result: any) => void,
) => void;

export function useGlobalState(): GlobalState {
  const [web3State, setWeb3State] = useState<Web3State>();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [data, setData] = useState<any>();

  const providerRef = useRef<any>(getWeb3Provider());
  const eventEmitterRef = useRef<EventEmitter>(new EventEmitter());

  const resetEvents = useCallback(() => {
    eventEmitterRef.current?.removeAllListeners();

    eventEmitterRef.current?.on('request', (args: any) => {
      setData(args);
      handleShowTransactionModal();
    });
  }, []);

  const handleShowTransactionModal = useCallback(() => {
    setShowTransactionModal(true);
  }, []);

  const handleCloseTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setData(undefined);
    resetEvents();
  }, []);

  const handleTransactionConfirm = useCallback((data: any) => {
    eventEmitterRef.current?.emit('confirm', data);
    setShowTransactionModal(false);
  }, []);

  const handleTransactionCancel = useCallback(() => {
    eventEmitterRef.current?.emit('cancel');
    setShowTransactionModal(false);
  }, []);

  const getProvider = useCallback((): any => {
    console.log(providerRef.current);
    return providerRef.current;
  }, []);

  useEffect(() => {
    if (web3State === Web3State.Done) {
      if (isMagicProvider()) {
        providerRef.current = new ProviderWrapper(
          getWeb3Provider(),
          eventEmitterRef.current,
        );
      } else {
        providerRef.current = getWeb3Provider();
      }

      resetEvents();
      return () => {
        eventEmitterRef.current?.removeAllListeners();
      };
    }
  }, [web3State]);

  // hack to watch the state without hook
  const handleChangeWeb3State = useCallback((state: Web3State) => {
    setWeb3State(state);
  }, []);

  return {
    getProvider,
    showTransactionModal,
    handleChangeWeb3State,
    handleShowTransactionModal,
    handleCloseTransactionModal,
    handleTransactionConfirm,
    handleTransactionCancel,
    data,
  };
}

export const GlobalStateContext = React.createContext<GlobalState>({
  getProvider: () => {},
  handleCloseTransactionModal: () => {},
  handleShowTransactionModal: () => {},
  showTransactionModal: false,
  handleChangeWeb3State: (web3State: Web3State) => {},
});

export function useAppGlobalState() {
  return useContext(GlobalStateContext);
}
