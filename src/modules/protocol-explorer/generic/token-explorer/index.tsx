import React, { PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';

import { Paper } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import { truncateAddress } from 'utils';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { TokenSearch } from 'shared/components/TokenSearch';
import TokenOrders from 'modules/protocol-explorer/common/TokenOrders';
import TokenPairs from 'modules/protocol-explorer/common/TokenPairs';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import TokenInfo from './TokenInfo';
import TokenStatistics from './TokenStatistics';
import {  TokenFilterProvider } from 'providers/protocol/tokenFilterProvider';
import FilterMenu from 'shared/components/Filter/menu';
import FilterList from 'shared/components/Filter/list';


type TokenParams = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
};

type TokenProps = RouteComponentProps<TokenParams> &
  PropsWithChildren<TokenParams>;

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const {
    match: { params },
  } = props;
  const { address, networkName, exchange } = params;

  const baseAddress =
    address ||
    (networkName === 'ethereum'
      ? (process.env.REACT_APP_DEFAULT_ETH_TOKEN as string)
      : (process.env.REACT_APP_DEFAULT_BSC_TOKEN as string));
  return (
    <>
      <TokenFilterProvider >
          <Box pt={{ xl: 4 }}>
           <PageTitle
              address={address}
              history={
                exchange === EXCHANGE.ALL
                  ? [
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/token-explorer/${baseAddress}`,
                      name: 'Protocol Explorer',
                    },
                  ]
                  : [
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/token-explorer/${baseAddress}`,
                      name: 'Protocol Explorer',
                    },
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/token-explorer/${baseAddress}`,
                      name: GET_EXCHANGE_NAME(exchange),
                    },
                  ]
              }
              active={`Token Explorer`}
              title={
                exchange == EXCHANGE.ALL
                  ? `Token Explorer ${truncateAddress(address)}`
                  : `Token Explorer ${truncateAddress(address)}`
              }
            />


            <GridContainer>
              <Grid item xs={12} md={12}>
                <Paper style={{ padding: 10 }}>
                <TokenSearchByList type={'token'} exchangeName={exchange} />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <TokenInfo address={address} />
              </Grid>

              <Grid item xs={12} md={6}>
               <TokenStatistics address={address} />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TokenPairs
                  address={baseAddress}
                  exchange={exchange}
                  networkName={networkName}
               />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Box display={'flex'} justifyContent={'flex-end'}>
                  <FilterList />
                  <FilterMenu />
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
              <TokenOrders
                    networkName={networkName}
                    baseAddress={baseAddress}
                    quoteAddress={null}
                    exchange={exchange}
                    type={'token'}
              />
              </Grid>
            </GridContainer>
          </Box>
      </TokenFilterProvider>
    </>
  );
};

export default TokenExplorer;
