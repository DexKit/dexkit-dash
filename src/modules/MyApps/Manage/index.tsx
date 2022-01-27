import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Grid, Box} from '@material-ui/core';
import {teal} from '@material-ui/core/colors';
import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import AppsTable from './apps-table';
//import TotalRewards from './TotalRewards';
import KitMarket from './kit-market';
import Ripple from 'assets/images/ripple.png';
//import LockUnlock from './LockUnlock';
import Alert from '@material-ui/lab/Alert';
//import {useBalance} from 'hooks/balance/useBalance';
//import ErrorView from 'modules/Common/ErrorView';
import AppsIcon from '@material-ui/icons/Apps';
import {AboutDialog} from './AboutDialog';
import {Fonts} from 'shared/constants/AppEnums';
// import LoadingInfo from 'modules/ProtocolExplorer/Common/InfoToken/LoadingInfo';
// import { setInsufficientAmountAlert } from 'redux/actions';

const MyApps: React.FC = () => {
  // const {loading, error, data: balances} = useBalance();
  // const [alertBalance, setAlertBalance] = useState(balances != null && balances.length > 0);

  const {insufficientAmountAlert} = useSelector<AppState, AppState['myApps']>(
    ({myApps}) => myApps,
  );

  // useEffect(() => {
  //   if (balances == null || balances.length === 0){
  //     // setAlertBalance(true);
  //     dispatch(setInsufficientAmountAlert(true));
  //   }
  // }, [balances, dispatch]);

  return (
    <>
      <Box pt={{xl: 4}}>
        <Box display='flex' alignItems='center' mt={1}>
          <AppsIcon color={'primary'} fontSize={'large'} />
          <Box
            component='h3'
            color='text.primary'
            fontWeight={Fonts.BOLD}
            ml={2}>
            Manage APPs
          </Box>
          <AboutDialog />
        </Box>

        <Box pb={2} mt={2}>
          <Alert severity='warning'>
            This feature is still under high development, You will need KIT to
            use this. Check our live updates to see when this feature will be
            enable for everyone!
          </Alert>
          {insufficientAmountAlert && (
            <Alert severity='warning'>
              You don't have the amount of sufficient kit to keep run your apps,
              which can cause them to be automatically deactivated.
            </Alert>
          )}
        </Box>
        <GridContainer>
         {/* <Grid item xs={12} md={6}>
            {loading ? (
              <LoadingInfo />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              <LockUnlock balances={balances} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TotalRewards />
            </Grid>*/}

          <Grid item xs={12} md={8}>
            <AppsTable />
          </Grid>

          <Grid item xs={12} md={4}>
            <KitMarket
              icon={Ripple}
              bgColor={teal[900]}
              data={{price: 4.0, increment: 0.8}}
              heading={<IntlMessages id='wizard.launch' />}
            />
          </Grid>
        </GridContainer>
      </Box>
    </>
  );
};

export default MyApps;
