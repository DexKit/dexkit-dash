import React, {ReactNode, useContext, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {setInitialPath} from '../redux/_settings/actions';
import {matchRoutes} from 'react-router-config';
import AppContext from '../@crema/utility/AppContext';
import {AppState} from '../redux/store';
import AppContextPropsType from '../types/AppContextPropsType';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import {NavStyle} from 'shared/constants/AppEnums';

interface AuthRoutesProps {
  children: ReactNode;
}

const WalletRoutes: React.FC<AuthRoutesProps> = ({children}) => {
  const {pathname} = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const {routes, changeNavStyle} = useContext<AppContextPropsType>(AppContext);

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
    if (pathname === LOGIN_WALLET_ROUTE) {
      if (changeNavStyle) {
        changeNavStyle(NavStyle.EMPTY_LAYOUT);
      }
    } else {
      if (changeNavStyle) {
        changeNavStyle(NavStyle.MINI_SIDEBAR_TOGGLE);
      }
    }
  }, [pathname, changeNavStyle]);

  useEffect(() => {
    if (
      !ethAccount &&
      !defaultAccount &&
      currentRoute.auth &&
      currentRoute.auth.length >= 1 &&
      currentRoute.auth.includes('wallet')
    ) {
      history.push(LOGIN_WALLET_ROUTE);
    } else if (pathname === '/no-wallet' && ethAccount) {
      if (initialPath !== '/no-wallet') {
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
      history.push(LOGIN_WALLET_ROUTE);
    } else if (pathname === '/connect-wallet' && ethAccount) {
      if (initialPath !== '/no-wallet') {
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
