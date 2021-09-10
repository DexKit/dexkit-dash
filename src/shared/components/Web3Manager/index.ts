import {useEffect} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {web3Modal} from 'services/web3modal';
import {isMobile} from 'web3modal';
import { useHistory } from 'react-router-dom';

export const Web3Manager = () => {
  const {onConnectWeb3} = useWeb3();
  const history = useHistory();
  const {web3, ethereum} = window;

  // Try to connect once at begin, check if provider is available and try to connect
  useEffect(() => {
    if (web3Modal.cachedProvider || (isMobile() && (web3 || ethereum))) {
      // We don't try to connect if we are on magic callback path
      if(history.location.pathname.indexOf('/magic/callback-social') === -1 || history.location.pathname.indexOf('/magic/callback') === -1 ){
        onConnectWeb3();
      }
    }
  }, []);

  return null;
};
