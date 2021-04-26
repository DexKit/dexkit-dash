import React from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';


import {  Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import { truncateAddress } from 'utils';
import TokenOrders from './TokenOrders';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import TokenPairs from './TokenPairs';
import { EXCHANGE } from 'shared/constants/Bitquery';

type TokenParams = {
  address: string;
};

type TokenProps = RouteComponentProps<TokenParams>

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const { match: { params } } = props;
  const { address } = params;

  return (
    <>
      {true ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
            <Grid item xs={12} md={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/protocol-explorer/sushiwap/overview">Protocol Explorer</Link>
                <Link color="inherit" href="/protocol-explorer/sushiwap/overview">SushiSwap</Link>
                <Typography color="textPrimary">Token Explorer</Typography>
                <Typography color="textPrimary">{truncateAddress(address)}</Typography>
              </Breadcrumbs>
              <Typography variant="h4"  color="textPrimary">SushiSwap Token Explorer</Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper style={{padding: 10}}>
                <TokenSearchByList url={'/protocol-explorer/sushiwap/token-explorer'} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TokenPairs address={address} />
            </Grid>

            {/*<Grid item xs={12} md={6}>
              <TokenInfo address={address} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TokenStatistics address={address} />
            </Grid> */}
            
            <Grid item xs={12} sm={12} md={12}>
              <TokenOrders address={address} exchange={EXCHANGE.SUSHISWAP}/>
            </Grid>

          </GridContainer>
        </Box>
      ) : null}
    </>
  );
};

export default TokenExplorer;


