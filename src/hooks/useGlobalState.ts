import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {ProviderWrapper} from 'types/ProviderWrapper';

import Web3 from 'web3';

import {getProvider as getWeb3Provider} from 'services/web3modal';
import {
  getCachedMagicNetwork,
  getMagicRPCProvider,
  isMagicProvider,
} from 'services/magic';
import EventEmitter from 'events';
import {Web3State} from 'types/blockchain';
import {providers} from 'ethers';

export interface GlobalState {
  showTransactionModal: boolean;
  showSignDataDialog: boolean;
  handleShowTransactionModal: () => void;
  handleCloseTransactionModal: () => void;
  handleTransactionConfirm?: (data: any) => void;
  handleTransactionCancel?: () => void;
  handleSignConfirm?: () => void;
  handleSignCancel?: () => void;
  handleChangeWeb3State: (web3State: Web3State) => void;
  data?: any;
  signData?: any;
  getProvider(): any;
  getEthersProvider(): any;
  getWeb3(): Web3 | null;
}

export function useGlobalState(): GlobalState {
  const [web3State, setWeb3State] = useState<Web3State>();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  // data for transactions
  const [data, setData] = useState<any>();

  const [showSignDataDialog, setShowSignDataDialog] = useState(false);
  // data for sign data RPC
  const [signData, setSignData] = useState<any>();

  const providerRef = useRef<any>(getWeb3Provider());
  const eventEmitterRef = useRef<EventEmitter>(new EventEmitter());

  // prefer "Dialog" instead of "Modal"
  const handleShowTransactionModal = useCallback(() => {
    setShowTransactionModal(true);
  }, []);

  const handleShowSignDataDialog = useCallback(() => {
    setShowSignDataDialog(true);
  }, []);

  const resetEvents = useCallback(() => {
    eventEmitterRef.current?.removeAllListeners();

    eventEmitterRef.current?.on('request', (args: any) => {
      setData(args);
      handleShowTransactionModal();
    });

    eventEmitterRef.current?.on('sign', (args: any) => {
      setSignData(args);
      handleShowSignDataDialog();
    });
  }, [handleShowTransactionModal, handleShowSignDataDialog]);

  const handleCloseTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setData(undefined);
    resetEvents();
  }, [resetEvents]);

  const handleTransactionConfirm = useCallback((data: any) => {
    eventEmitterRef.current?.emit('confirm', data);
    setShowTransactionModal(false);
  }, []);

  const handleTransactionCancel = useCallback(() => {
    eventEmitterRef.current?.emit('cancel');
    setShowTransactionModal(false);
  }, []);

  const handleSignConfirm = useCallback(() => {
    eventEmitterRef.current?.emit('sign.confirm');
    setShowSignDataDialog(false);
  }, []);

  const handleSignCancel = useCallback(() => {
    eventEmitterRef.current?.emit('sign.cancel');
    setShowSignDataDialog(false);
  }, []);

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
    if (web3State === Web3State.Done) {
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
  }, [web3State]);

  // hack to watch the state without hook
  const handleChangeWeb3State = useCallback((state: Web3State) => {
    setWeb3State(state);
  }, []);

  return {
    getProvider,
    showTransactionModal,
    showSignDataDialog,
    handleChangeWeb3State,
    handleShowTransactionModal,
    handleCloseTransactionModal,
    handleTransactionConfirm,
    handleTransactionCancel,
    handleSignConfirm,
    handleSignCancel,
    getEthersProvider,
    data,
    signData,
    getWeb3,
  };
}

export const GlobalStateContext = React.createContext<GlobalState>({
  getProvider: () => {},
  getEthersProvider: () => {},
  handleCloseTransactionModal: () => {},
  handleShowTransactionModal: () => {},
  showTransactionModal: false,
  showSignDataDialog: false,
  handleSignCancel: () => {},
  handleSignConfirm: () => {},
  handleChangeWeb3State: (web3State: Web3State) => {},
  getWeb3: () => {
    return null;
  },
});

export function useAppGlobalState() {
  return useContext(GlobalStateContext);
}
