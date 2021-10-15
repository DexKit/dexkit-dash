import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setWeb3State} from 'redux/_blockchain/actions';
import {
  getAuthMagicProvider,
  getCachedMagicNetwork,
  getMagic,
  getMagicProvider,
  getMagicRPCProvider,
  isMagicProvider,
  isMagicTestnet,
  MagicNetworks,
  setAuthMagicProvider,
  setCachedMagicNetwork,
  setIsMagicProvider,
} from 'services/magic';
import {getEmailConnector} from 'services/magic/email-connectos';
import {
  getSocialConnector,
  SupportSocialConnectors,
} from 'services/magic/social-connectos';
import {Web3State} from 'types/blockchain';
import {Magic} from 'magic-sdk';
import {getWeb3} from 'services/web3modal';

export const useMagicProvider = () => {
  const dispatch = useDispatch();
  const {setProvider} = useWeb3();

  const onConnectMagicSocial = useCallback(
    async (social: SupportSocialConnectors) => {
      try {
        dispatch(setWeb3State(Web3State.Connecting));
        setIsMagicProvider('false');
        const provider = await getSocialConnector(social);
        setAuthMagicProvider(social);
        setProvider(provider);
        dispatch(setWeb3State(Web3State.Done));
      } catch {
        setIsMagicProvider('false');
      }
    },
    [],
  );

  const onConnectMagicEmail = useCallback(async (email: string) => {
    try {
      dispatch(setWeb3State(Web3State.Connecting));
      setIsMagicProvider('false');
      const provider = await getEmailConnector(email);
      setAuthMagicProvider('email');
      setProvider(provider);
      dispatch(setWeb3State(Web3State.Done));
    } catch {
      setIsMagicProvider('false');
    }
  }, []);
  const onConnectMagic = useCallback(async () => {
    try {
      dispatch(setWeb3State(Web3State.Connecting));
      const provider = await getMagicProvider();
      setProvider(provider);
      dispatch(setWeb3State(Web3State.Done));
      setIsMagicProvider('true');
      const web3 = getWeb3();
      const accounts = await web3?.eth.getAccounts();
      return accounts;
    } catch (e) {
      console.log('error magic:', e);
      dispatch(setWeb3State(Web3State.NotConnected));
      setIsMagicProvider('false');
    }
  }, []);

  const onSwitchMagicNetwork = useCallback(async (network: MagicNetworks) => {
    if (isMagicProvider()) {
      dispatch(setWeb3State(Web3State.Connecting));
      const cachedNetwork = getCachedMagicNetwork();
      // they are both at same Mainnet or Testnet
      if (isMagicTestnet(cachedNetwork) === isMagicTestnet(network)) {
        setCachedMagicNetwork(network);
        const provider = await getMagicRPCProvider(network);
        setProvider(provider);
        dispatch(setWeb3State(Web3State.Done));
      } else {
        // If different mainnet and testnet we need to do login again
        const authProvider = getAuthMagicProvider();

        if (authProvider === 'email') {
          const magic = getMagic(cachedNetwork) as Magic;
          setCachedMagicNetwork(network);
          const metadata = await magic.user.getMetadata();
          if (metadata.email) {
            onConnectMagicEmail(metadata.email);
          }
        } else {
          setCachedMagicNetwork(network);
          onConnectMagicSocial(authProvider);
        }
      }
    }
  }, []);

  return {
    onConnectMagicEmail,
    onConnectMagicSocial,
    onSwitchMagicNetwork,
    onConnectMagic,
  };
};
