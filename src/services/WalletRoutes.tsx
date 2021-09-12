import React, {ReactNode, useContext, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {setInitialPath} from '../redux/_settings/actions';
import {matchRoutes} from 'react-router-config';
import AppContext from '../@crema/utility/AppContext';
import {AppState} from '../redux/store';
import AppContextPropsType from '../types/AppContextPropsType';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

interface AuthRoutesProps {
  children: ReactNode;
}

const WalletRoutes: React.FC<AuthRoutesProps> = ({children}) => {
  const {pathname} = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const {routes} = useContext<AppContextPropsType>(AppContext);

  const ethAccount = useSelector<
    AppState,
    AppState['blockchain']['ethAccount']
  >((state) => state.blockchain.ethAccount);
  const defaultAccount = useDefaultAccount();
  const {initialPath} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );
  const currentRoute = matchRoutes(routes, pathname)[0].route;

  useEffect(() => {
    function setInitPath() {
      if (
        initialPath === '/' &&
        [
          '/signin',
          '/signup',
          '/confirm-signup',
          '/reset-password',
          '/forget-password',
        ].indexOf(pathname) === -1
      ) {
        dispatch(setInitialPath(pathname));
      }
    }

    setInitPath();
  }, [dispatch, initialPath, pathname, ethAccount]);

  useEffect(() => {
    if (
      !ethAccount &&
      !defaultAccount &&
      currentRoute.auth &&
      currentRoute.auth.length >= 1 &&
      currentRoute.auth.includes('wallet')
    ) {
      history.push('/onboarding/login-wallet');
    } else if (pathname === '/no-wallet' && ethAccount) {
      // @ts-ignore
      if (pathname === '/') {
        history.push('/wallet');
      }
      // @ts-ignore
      else if (initialPath !== '/no-wallet') {
        history.push(initialPath);
      } else {
        history.push('/wallet');
      }
    }

    if (
      !ethAccount &&
      currentRoute.auth &&
      currentRoute.auth.length >= 1 &&
      currentRoute.auth.includes('connect-wallet')
    ) {
      history.push('/onboarding/login-wallet');
    } else if (pathname === '/connect-wallet' && ethAccount) {
      // @ts-ignore
      if (pathname === '/') {
        history.push('/wallet');
      }
      // @ts-ignore
      else if (initialPath !== '/no-wallet') {
        history.push(initialPath);
      } else {
        history.push('/wallet');
      }
    }
  }, [
    ethAccount,
    pathname,
    initialPath,
    currentRoute.auth,
    history,
    defaultAccount,
  ]);

  return <>{children}</>;
};

export default WalletRoutes;
