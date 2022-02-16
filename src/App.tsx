import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import AppLayout from '@crema/core/AppLayout';
import LocaleProvider from '@crema/utility/LocaleProvider';
import CremaThemeProvider from '@crema/utility/CremaThemeProvider';
import CremaStyleProvider from '@crema/utility/CremaStyleProvider';
import ContextProvider from '@crema/utility/ContextProvider';
import {InfoView} from '@crema';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ApolloProvider} from '@apollo/client';
import store, {history} from './redux/store';
import {client} from 'services/graphql';
import WalletRoutes from 'services/WalletRoutes';
import {Web3Manager} from 'shared/components/Web3Manager';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import {QueryClient, QueryClientProvider} from 'react-query';
import CacheBuster from 'shared/components/CacheBuster';

import {SnackbarProvider} from 'notistack';

const queryClient = new QueryClient();

const App = () => (
  <ContextProvider>
    <CacheBuster />
    <Provider store={store}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <CremaThemeProvider>
            <CremaStyleProvider>
              <LocaleProvider>
                <ConnectedRouter history={history}>
                  <SnackbarProvider maxSnack={3}>
                    <WalletRoutes>
                      <CssBaseline />
                      <Web3Manager />
                      <ReactNotification />

                      {/*  <ThemeSetting props={{}}/>*/}
                      <InfoView />
                      <AppLayout />
                    </WalletRoutes>
                  </SnackbarProvider>
                </ConnectedRouter>
              </LocaleProvider>
            </CremaStyleProvider>
          </CremaThemeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </Provider>
  </ContextProvider>
);

export default App;
