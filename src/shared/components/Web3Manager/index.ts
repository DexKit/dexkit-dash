import {useEffect} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {web3Modal} from 'services/web3modal';
import {isMobile} from 'web3modal';
import { useHistory } from 'react-router-dom';
import { isMagicProvider } from 'services/magic';
import { useMagicProvider } from 'hooks/provider/useMagicProvider';

export const Web3Manager = () => {
  const { onConnectWeb3 } = useWeb3();
  const { onConnectMagic } = useMagicProvider();
  const history = useHistory();
  const {web3, ethereum} = window;

  // Try to connect once at begin, check if provider is available and try to connect
  useEffect(() => {
    
    if(isMagicProvider()){
         // We don't try to connect if we are on magic callback path
      if(history.location.pathname.indexOf('/magic/callback-social') === -1 || history.location.pathname.indexOf('/magic/callback') === -1 ){
        console.log('calling magic provider');
        onConnectMagic();
       }
      
     
    }else{
      if (web3Modal.cachedProvider || (isMobile() && (web3 || ethereum))) {
     
          onConnectWeb3();
      }

    }
    
  }, []);

  return null;
};
