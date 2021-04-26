import React from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';

import Box from '@material-ui/core/Box';

import InfoCard from './InfoCard';

import { INFOR_CARD } from './Data'
import { Typography, Link, Breadcrumbs } from '@material-ui/core';

import OrdersTokens from './OrdersTokens';
import TokenOrders from 'modules/protocol-explorer/common/TokenOrders';
import { EXCHANGE } from 'shared/constants/Bitquery';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { useChainId } from 'hooks/useChainId';


interface Props { }


const Overview: React.FC<Props> = (props) => {
  const {currentChainId} = useChainId();
  return (
    <>
      <Box pt={{ xl: 4 }}>
        <GridContainer>
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/protocol-explorer/uniswap/overview" >Protocol Explorer</Link>
              <Link color="inherit" href="/protocol-explorer/uniswap/overview" >Uniswap</Link>
            </Breadcrumbs>
            <Typography variant="h4" color="textPrimary">Protocol Explorer Uniswap</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <GridContainer>
              {INFOR_CARD.map((state, index) => (
                <Grid item xs={12} sm={3} md={12} key={index}>
                  <InfoCard state={state} />
                </Grid>
              ))}
            </GridContainer>
          </Grid>

          <Grid item xs={12} md={8}>
            <OrdersTokens />
          </Grid>

          <Grid item xs={12} md={12}>
             <TokenOrders baseAddress={null} quoteAddress={GET_DEFAULT_QUOTE(currentChainId)} exchange={EXCHANGE.UNISWAP} type={'token'}/>
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


