import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { ProviderWrapper } from 'types/ProviderWrapper';

import Web3 from 'web3';

import { getProvider as getWeb3Provider } from 'services/web3modal';
import {
  getCachedMagicNetwork,
  getMagicRPCProvider,
  isMagicProvider,
} from 'services/magic';
import EventEmitter from 'events';
import { Web3State } from 'types/blockchain';
import { providers } from 'ethers';

export interface GlobalState {
  showTransactionModal: boolean;
  handleShowTransactionModal: () => void;
  handleCloseTransactionModal: () => void;
  handleTransactionConfirm?: (data: any, txIndex: number) => void;
  handleTransactionCancel?: (txIndex: number) => void;
  handleChangeWeb3State: (web3State: Web3State) => void;
  data?: any;
  getProvider(): any;
  getEthersProvider(): any;
  getWeb3(): Web3 | null;
}

export function useGlobalState(): GlobalState {
  const [web3State, setWeb3State] = useState<Web3State>();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [data, setData] = useState<any>([]);

  const providerRef = useRef<any>(getWeb3Provider());
  const eventEmitterRef = useRef<EventEmitter>(new EventEmitter());

  const handleShowTransactionModal = useCallback(() => {
    setShowTransactionModal(true);
  }, []);

  const resetEvents = useCallback(() => {
    eventEmitterRef.current?.removeAllListeners();

    eventEmitterRef.current?.on('request', (args: any) => {
      const newData = [...data];
      newData.push(args);
      setData(newData);
      handleShowTransactionModal();
    });
  }, [handleShowTransactionModal, data]);

  const handleCloseTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setData([]);
    resetEvents();
  }, [resetEvents]);

  const handleTransactionConfirm = useCallback((txData: any, txIndex: number) => {
    eventEmitterRef.current?.emit('confirm', txData);
    if (txIndex + 1 >= data.length) {
      setShowTransactionModal(false);
      setData([]);
    }
  }, [data]);

  const handleTransactionCancel = useCallback((txIndex: number) => {
    eventEmitterRef.current?.emit('cancel');
    if (txIndex + 1 >= data.length) {
      setShowTransactionModal(false);
      setData([]);
    }
  }, [data]);

  const getProvider = useCallback((): any => {
    return providerRef.current;
  }, []);

  const getWeb3 = useCallback((): any => {
    return new Web3(providerRef.current);
  }, []);

  const getEthersProvider = useCallback((): any => {
    return new providers.Web3Provider(providerRef.current);
  }, []);

  /* eslint-disable */
  useEffect(() => {
    if (web3State === Web3State.Done && data) {
      if (isMagicProvider()) {
        const magicNetwork = getCachedMagicNetwork();
        providerRef.current = new ProviderWrapper(
          getMagicRPCProvider(magicNetwork),
          eventEmitterRef.current,
        );
      } else {
        providerRef.current = getWeb3Provider();
      }

      let emmiter = eventEmitterRef.current;

      resetEvents();
      return () => {
        emmiter.removeAllListeners();
      };
    }
  }, [web3State, data]);

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
    getEthersProvider,
    data,
    getWeb3,
  };
}

export const GlobalStateContext = React.createContext<GlobalState>({
  getProvider: () => { },
  getEthersProvider: () => { },
  handleCloseTransactionModal: () => { },
  handleShowTransactionModal: () => { },
  showTransactionModal: false,
  handleChangeWeb3State: (web3State: Web3State) => { },
  getWeb3: () => {
    return null;
  },
});

export function useAppGlobalState() {
  return useContext(GlobalStateContext);
}
