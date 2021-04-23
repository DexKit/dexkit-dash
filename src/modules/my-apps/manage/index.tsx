import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import {Grid, Box} from '@material-ui/core';
import { teal } from '@material-ui/core/colors';
import GridContainer from '@crema/core/GridContainer';
import InfoView from '@crema/core/InfoView';
import IntlMessages from '@crema/utility/IntlMessages';
import AppsTable from './apps-table';
import TotalRewards from './TotalRewards';
import KitMarket from './kit-market';
import Ripple from 'assets/images/ripple.png'
import { onGetMyTokenBalances } from 'redux/actions';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import LockUnlock from './LockUnlock';

const MyApps: React.FC = () => {
  const dispatch = useDispatch();
  const { account, chainId } = useWeb3();
  
  const { myBalances } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );

  useEffect(() => {
    if (account != null) {
      dispatch(onGetMyTokenBalances(GET_NETWORK_NAME(chainId), account));
    }
  }, [dispatch, account]);


  return (
    <>
      <Box pt={{ xl: 4 }}>
        <GridContainer>

          <Grid item xs={12} md={6}>
            <LockUnlock balances={myBalances} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TotalRewards />
          </Grid>

          <Grid item xs={12} md={8}>
            <AppsTable />
          </Grid>

          <Grid item xs={12} md={4}>
            <KitMarket icon={Ripple} bgColor={teal[900]} data={{ price: 4.0, increment: 0.8 }} heading={<IntlMessages id='app.kitMarket' />} />
          </Grid>

        </GridContainer>
      </Box>


      <InfoView />
    </>
  );
};

export default MyApps;
