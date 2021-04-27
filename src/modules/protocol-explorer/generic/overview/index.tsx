import React, { PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import InfoCard from './InfoCard';
import { Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrdersPairs from './OrdersPairs';
import OrdersTokens from './OrdersTokens';
import { RouteComponentProps } from 'react-router-dom';
import { populateInforCard } from './populateInforCard';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';


interface OverviewProps {
  exchange: EXCHANGE;
  networkName: NETWORK;
}

type Props = RouteComponentProps<OverviewProps> & PropsWithChildren<OverviewProps>;

const Overview: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const { networkName, exchange } = params;

  return (
    <>
      <Box pt={{ xl: 4 }}>
        <PageTitle
          history={
            exchange == EXCHANGE.ALL ? [
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
            ]:[
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name:  GET_EXCHANGE_NAME(exchange)}
            ]}
          active={`Overview`}
          title={`Protocol Explorer ${GET_EXCHANGE_NAME(exchange)}`}
        />

        <GridContainer>
          <Grid item xs={12} md={4}>
            <GridContainer>
              {
                populateInforCard(networkName, exchange).map((state, index) => (
                  <Grid item xs={12} sm={3} md={12} key={index}>
                    <InfoCard state={state} />
                  </Grid>
                ))
              }
            </GridContainer>
          </Grid>

          <Grid item xs={12} md={8}>
            <OrdersTokens networkName={networkName} exchange={exchange} />
          </Grid>

          <Grid item xs={12} md={12}>
            {/* <OrdersPairs networkName={networkName} exchange={exchange} /> */}
          </Grid>
        </GridContainer>
      </Box>
    </>

    // <>
    //   {cryptoData ? (
    //     <Box pt={{ xl: 4 }}>
    //       <GridContainer>

    //         <Grid item xs={12} md={12}>
    //           <Breadcrumbs aria-label="breadcrumb">
    //             <Link color="inherit" href="/" >
    //               Protocol Explorer
    //           </Link>
    //             <Link color="inherit" href="/getting-started/installation/" >
    //               Uniswuap
    //           </Link>
    //           </Breadcrumbs>
    //           <Typography variant="h4" color="textPrimary">Protocol Explorer Uniswap</Typography>

    //         </Grid>
    //         <Grid item xs={12} md={3}>
    //           <GridContainer >
    //             <Grid item xs={12} sm={3} md={12}>
    //               {/* <Grid item xs={12} md={12}>
    //             <Paper style={{padding: 10}}>

    //         {
    //         fullWidth
    //         id="input-with-icon-textfield"
    //         variant='outlined'
    //         placeholder='Search'
    //         InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <SearchRounded />
    //           </InputAdornment>
    //         ),
    //     }}
    //   />
    //             </Paper>

    //   </Grid> */}
    //             </Grid>
    //             {INFOR_CARD.map((state, index) => (
    //               <Grid item xs={12} sm={3} md={12} key={index}>
    //                 <InfoCard state={state} />
    //               </Grid>
    //             ))}
    //           </GridContainer>
    //         </Grid>

    //         <Grid item xs={12} md={6}>
    //           <PaperInfo />
    //         </Grid>

    //         <Grid item xs={12} md={3}>
    //           <PopularCoins title="Hot Tokens" popularCoins={cryptoData.popularCoins} />
    //         </Grid>

    //       </GridContainer>
    //     </Box>
    //   ) : null}

    //   <InfoView />
    // </>
  );
};

export default Overview;


