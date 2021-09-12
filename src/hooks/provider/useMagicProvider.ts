import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { setWeb3State } from 'redux/_blockchain/actions';
import { getMagicProvider, getMagicRPCProvider, isMagicProvider, setAuthMagicProvider, setIsMagicProvider} from 'services/magic';
import {getEmailConnector} from 'services/magic/email-connectos';
import {
  getSocialConnector,
  SupportSocialConnectors,
} from 'services/magic/social-connectos';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { Web3State } from 'types/blockchain';

export const useMagicProvider = () => {
  const dispatch = useDispatch();
  const {setProvider} = useWeb3();

  const onConnectMagicSocial = useCallback(
    async (social: SupportSocialConnectors) => {
      try {
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
      setIsMagicProvider('false');
      const provider = await getEmailConnector(email);
      setAuthMagicProvider('email');
      setProvider(provider);
      dispatch(setWeb3State(Web3State.Done));
     
    } catch {
      setIsMagicProvider('false');
    }
  }, []);
  const onConnectMagic = useCallback( async () => {
    try{
        console.log('on-connect magic'); 
        dispatch(setWeb3State(Web3State.Connecting));
        const provider = await getMagicProvider();
        setProvider(provider);
        console.log(provider);
        dispatch(setWeb3State(Web3State.Done));
        setIsMagicProvider('true');
    }catch(e){
      console.log(e);
      dispatch(setWeb3State(Web3State.NotConnected));
        setIsMagicProvider('false');
    }
  },[])

  const onSwitchMagicNetwork = useCallback( async (network: EthereumNetwork) => {
    if(isMagicProvider()){
      dispatch(setWeb3State(Web3State.Connecting));
      const provider = await getMagicRPCProvider(network);
      setProvider(provider);
      dispatch(setWeb3State(Web3State.Done));
    }

  },[])



  return {
    onConnectMagicEmail,
    onConnectMagicSocial,
    onSwitchMagicNetwork,
    onConnectMagic,
  };
};
