import React, {useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../../redux/store';
import PopularCoins from './PopularCoins';
import ReportCard from './ReportCard';
import RecentPatients from './RecentPatients';
import { MOCK, RECENT_PATIENTE} from './mockedData'
import {  Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
import { getToken } from 'services/rest/coingecko';
import { CoinDetailCoinGecko } from 'types/coingecko';
import { PopularCoinsData } from 'types/models/Crypto';
import { ReportCards } from 'types/models/Ecommerce';


type TokenParams = {
  address: string;
};



type TokenProps = RouteComponentProps<TokenParams>

const Overview: React.FC<TokenProps> = (props) => {
  const {match: { params }} = props;
  const { address } = params;

  // const dispatch = useDispatch();

  const [token, setToken] = useState<PopularCoinsData[]>([]);

  // const {data} = useSelector<AppState, AppState['dashboard']>(
  //   ({dashboard}) => dashboard,
  // );

  return (
    <>
      {true ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
            <Grid item xs={12} md={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" >Protocol Explorer</Link>
                <Link color="inherit" href="/getting-started/installation/" >Uniswap</Link>
                <Typography color="textPrimary">Token Explorer</Typography>
              </Breadcrumbs>
              <Typography variant="h4"  color="textPrimary">Token Explorer</Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper style={{padding: 10}}>
                <TokenSearch url={'/protocol-explorer/uniswap/tokens'} />
              </Paper>
            </Grid>  
            
            <Grid item xs={12} sm={12} md={12}>
              <RecentPatients recentPatients={RECENT_PATIENTE} />
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

      <InfoView />
    </>
  );
};

export default Overview;


