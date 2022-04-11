import { useCallback, useEffect } from 'react';
import { useWeb3 } from 'hooks/useWeb3';
import { web3Modal } from 'services/web3modal';
import { isMobile } from 'web3modal';
import { useHistory, useLocation } from 'react-router-dom';
import { isMagicProvider } from 'services/magic';
import { useMagicProvider } from 'hooks/provider/useMagicProvider';
import { LOGIN_WALLET_ROUTE, WALLET_ROUTE } from 'shared/constants/routes';

export const Web3Manager = () => {
  const { onConnectWeb3 } = useWeb3();
  const { onConnectMagic } = useMagicProvider();
  const history = useHistory();
  const { pathname } = useLocation();
  const { web3, ethereum } = window;


  const afterConnectWallet = useCallback((a: string) => {
    if (pathname === LOGIN_WALLET_ROUTE) {
      history.push(`${WALLET_ROUTE}/${a}`);
    }

  }, [pathname, history])

  // Try to connect once at begin, check if provider is available and try to connect
  /* eslint-disable */
  useEffect(() => {
    if (isMagicProvider()) {
      // We don't try to connect if we are on magic callback path
      if (
        history.location.pathname.indexOf('/magic/callback-social') === -1 ||
        history.location.pathname.indexOf('/magic/callback') === -1
      ) {
        onConnectMagic()
          .then((acc) => {
            // When we connect wallet we want to see our connected wallet
            if (
              history.location.pathname.startsWith(WALLET_ROUTE) &&
              acc &&
              acc.length
            ) {
              history.push(`${WALLET_ROUTE}/${acc[0]}`);
            }
          })
          .catch(console.log);
      }
    } else {
      if (
        web3Modal.cachedProvider ||
        (isMobile() && (web3 || ethereum)) ||
        (ethereum && ethereum?.isMetaMask)
      ) {

        onConnectWeb3(afterConnectWallet);
      }
    }
  }, []);

  return null;
};
