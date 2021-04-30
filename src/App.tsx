import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import AppLayout from '@crema/core/AppLayout';
import LocaleProvider from '@crema/utility/LocaleProvider';
import CremaThemeProvider from '@crema/utility/CremaThemeProvider';
import CremaStyleProvider from '@crema/utility/CremaStyleProvider';
import ContextProvider from '@crema/utility/ContextProvider';
import { InfoView, ThemeSetting } from '@crema';

import { ApolloProvider } from '@apollo/client';

import store, {history} from './redux/store';
import CssBaseline from '@material-ui/core/CssBaseline';
// import { client } from 'services/graphql';
import WalletRoutes from 'services/WalletRoutes';
import { Web3Manager } from 'shared/components/Web3Manager';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


const App = () => (
  <ContextProvider>
    <Provider store={store}>
    {/* <ApolloProvider client={client}> */}
      <CremaThemeProvider>
        <CremaStyleProvider>
          <LocaleProvider>
            <ConnectedRouter history={history}>
              <WalletRoutes>
                <CssBaseline />
                <Web3Manager/>
                <ReactNotification />
                {/*<ThemeSetting props={{}}/>*/}
                <InfoView />
                <AppLayout />
              </WalletRoutes>
            </ConnectedRouter>
          </LocaleProvider>
        </CremaStyleProvider>
      </CremaThemeProvider>
      {/* </ApolloProvider>, */}
    </Provider>
  </ContextProvider>
);

export default App;
