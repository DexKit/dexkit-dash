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
import { useWeb3 } from 'hooks/useWeb3';
import LockUnlock from './LockUnlock';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import Alert from '@material-ui/lab/Alert';
import { useBalance } from 'hooks/balance/useBalance';
import ErrorView from 'modules/Common/ErrorView';
import LoadingView from 'modules/Common/LoadingView';

const MyApps: React.FC = () => {
  const dispatch = useDispatch();
  const { account, chainId } = useWeb3();
  const { loading, error, data } = useBalance();
  

  return (
    <>
      <Box pt={{ xl: 4 }}>
         <Box pb={2}>
              <Alert severity="warning">This feature is still under high development, You will need KIT to use this. Check our live updates to see when this feature
                will be enable for everyone!
            </Alert>
         </Box>
        <GridContainer>

          <Grid item xs={12} md={6}>
            {
              loading ? <LoadingView /> : error ? <ErrorView message={error.message} /> : (
                <LockUnlock balances={data} />
              )
            }
          </Grid>

          <Grid item xs={12} md={6}>
            <TotalRewards />
          </Grid>

          <Grid item xs={12} md={8}>
            <AppsTable />
          </Grid>

          <Grid item xs={12} md={4}>
            <KitMarket icon={Ripple} bgColor={teal[900]} data={{ price: 4.0, increment: 0.8 }} heading={<IntlMessages id='wizard.launch' />} />
          </Grid>

        </GridContainer>
      </Box>


      <InfoView />
    </>
  );
};

export default MyApps;
