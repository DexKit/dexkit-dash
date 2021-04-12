import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { onGetCryptoData } from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import { AppState } from '../../../../redux/store';
import PopularCoins from './PopularCoins';
import InfoCard from './InfoCard';
import PaperInfo from './PaperInfo';
import { INFOR_CARD } from './Data'
import { Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrdersPairs from './OrdersPairs';
import OrdersTokens from './OrdersTokens';


interface Props { }


const Overview: React.FC<Props> = (props) => {

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
            <OrdersPairs />
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


