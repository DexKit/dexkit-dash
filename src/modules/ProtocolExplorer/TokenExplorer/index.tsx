import React, {PropsWithChildren} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Box, Grid, Paper} from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';

import {truncateAddress} from 'utils';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';

import TokenInfo from './TokenInfo';
import TokenStatistics from './TokenStatistics';

// import {TokenSearch} from 'shared/components/TokenSearch';
// import TokenOrders from 'modules/protocol-explorer/common/TokenOrders';
// import TokenPairs from 'modules/protocol-explorer/common/TokenPairs';
// import {TokenSearchByList} from 'shared/components/TokenSearchByList';

type Params = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;

  const {networkName, exchange, address} = params;

  const baseAddress =
    address ||
    (networkName === 'ethereum'
      ? (process.env.REACT_APP_DEFAULT_ETH_TOKEN as string)
      : (process.env.REACT_APP_DEFAULT_BSC_TOKEN as string));

  return (
    <>
      <Box pt={{xl: 4}}>
        <PageTitle
          address={address}
          history={
            exchange === EXCHANGE.ALL
              ? [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                    name: 'Protocol Explorer',
                  },
                ]
              : [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                    name: 'Protocol Explorer',
                  },
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/token-explorer`,
                    name: GET_EXCHANGE_NAME(exchange),
                  },
                ]
          }
          active={`Token Explorer`}
          title={
            exchange === EXCHANGE.ALL
              ? `Token Explorer`
              : `Token Explorer ${truncateAddress(address)}`
          }
        />

        <GridContainer>
          {/* <Grid item xs={12} md={12}>
            <Paper style={{padding: 10}}>
              <TokenSearchByList type={'token'} exchangeName={exchange} />
            </Paper>
          </Grid> */}

          <Grid item xs={12} md={6}>
            <TokenInfo address={address} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TokenStatistics address={address} />
          </Grid>

          {/* <Grid item xs={12} sm={12} md={12}>
            <TokenPairs
              address={baseAddress}
              exchange={exchange}
              networkName={networkName}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <TokenOrders
              networkName={networkName}
              baseAddress={baseAddress}
              quoteAddress={null}
              exchange={exchange}
              type={'token'}
            />
          </Grid> */}
        </GridContainer>
      </Box>
    </>
  );
};

export default TokenExplorer;
