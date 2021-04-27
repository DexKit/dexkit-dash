import React, { PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';
import TokenInfo from './TokenInfo';
import TokenStatistics from './TokenStatistics';
import {  Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
import { truncateAddress } from 'utils';
import TokenOrders from './TokenOrders';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';

type TokenParams = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
};

type TokenProps = RouteComponentProps<TokenParams> & PropsWithChildren<TokenParams>;

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const {match: { params }} = props;
  const { address, networkName, exchange } = params;

  return (
    <>
      {true ? (
        <Box pt={{xl: 4}}>

          <PageTitle
            history={
              exchange == EXCHANGE.ALL ? [
                {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
              ]:[
                {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
                {url:`/${networkName}/protocol-explorer/${exchange}/token-explorer`, name:  GET_EXCHANGE_NAME(exchange)}
              ]}
            active={`Token Explorer`}
            title={exchange == EXCHANGE.ALL ? `Token Explorer` : `Token Explorer ${truncateAddress(address)}`}
          />

          <GridContainer>

            <Grid item xs={12} md={12}>
              <Paper style={{padding: 10}}>
                <TokenSearch />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <TokenInfo address={address} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TokenStatistics address={address} />
            </Grid>
            
            <Grid item xs={12} sm={12} md={12}>
              <TokenOrders address={address} />
            </Grid>

          </GridContainer>
        </Box>

        // <Box pt={{xl: 4}}>
        //   <GridContainer>
        //     <Grid item xs={12} md={12}>
        //       <Breadcrumbs aria-label="breadcrumb">
        //         <Link color="inherit" href="/" >
        //           Protocol Explorer
        //         </Link>
        //         <Link color="inherit" href="/getting-started/installation/" >
        //           Uniswuap
        //         </Link>
        //         <Typography color="textPrimary">Token Explorer</Typography>
        //       </Breadcrumbs>
        //       <Typography variant="h4"  color="textPrimary">Token Explorer</Typography>

        //     </Grid>

        //     <Grid item xs={12} md={8}>
        //       <Paper style={{padding: 10}}>
        //         <TokenSearch url={'/protocol-explorer/uniswap/tokens'} />
        //       </Paper>
        //     </Grid>  
            
        //     <Grid item xs={12} sm={12} md={4}>
        //       <RecentPatients recentPatients={RECENT_PATIENTE} />
        //     </Grid>

        //     <Grid item xs={12} md={4}>
        //       <PopularCoins title="Trending " popularCoins={cryptoData.popularCoins} />
        //     </Grid>

        //     <Grid item xs={12} md={4} >
        //       {MOCK.map((data, index) => (
        //         <div style={{marginTop: index > 0 ? 36 : '' }}>
        //           <ReportCard key={data.id} data={data} />
        //         </div>
        //       ))}    
        //     </Grid>
        //   </GridContainer>
        // </Box>
      ) : null}
    </>
  );
};

export default TokenExplorer;


