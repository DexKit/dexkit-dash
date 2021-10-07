/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Link, BrowserRouter as Router} from 'react-router-dom';

import {Grid, Box, Breadcrumbs, Typography} from '@material-ui/core';
import GridContainer from '@crema/core/GridContainer';
import InfoView from '@crema/core/InfoView';
import Alert from '@material-ui/lab/Alert';
import {useBalance} from 'hooks/balance/useBalance';
import ErrorView from 'modules/Common/ErrorView';
import LoadingInfo from 'modules/ProtocolExplorer/Common/InfoToken/LoadingInfo';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import WizardCard from '../../components/WizardCard';
import BalanceCard from '../../components/BalanceCard';
// import { setInsufficientAmountAlert } from 'redux/actions';

type Props = {rewards?: any[]};

const MyApps: React.FC<Props> = (props) => {
  const {loading, error, data: balances} = useBalance();
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
    <GridContainer spacing={2}>
      <GridContainer spacing={2}>
        <Grid container>
          <Router>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.8rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link to='/wallet' style={{textDecoration: 'none'}}>
                <Typography variant='subtitle2'>Dashboard</Typography>
              </Link>
              <Typography variant='subtitle2' style={{color: '#2e3243'}}>
                Manage Apps
              </Typography>
            </Breadcrumbs>
          </Router>
        </Grid>
        <Grid container xs={12} sm={10} alignContent='center'>
          <Typography
            variant='h5'
            style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
            Manage Apps
          </Typography>
        </Grid>
      </GridContainer>

      <Box pb={5}>
        <Alert severity='warning'>
          This feature is still under high development, You will need KIT to use
          this. Check our live updates to see when this feature will be enable
          for everyone!
        </Alert>
        {insufficientAmountAlert && (
          <Alert severity='warning'>
            You don't have the amount of sufficient kit to keep run your apps,
            which can cause them to be automatically deactivated.
          </Alert>
        )}
      </Box>

      {/* SUBTITULO */}
      <GridContainer spacing={6}>
        <Grid item md={6} xs={12}>
          <BalanceCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <WizardCard />
        </Grid>
      </GridContainer>
      {/* FIM SUBTITULO */}

      {/* REWARDS */}
      <GridContainer style={{marginTop: 10}}>
        <Grid container>
          <Grid item xs={12}>
            <Typography>Current Collected Total rewards</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {props.rewards?.map((reward, i) => (
            <Grid item xs={3} key={i}>
              {reward}
            </Grid>
          ))}
        </Grid>
      </GridContainer>
      {/* FIM REWARDS */}

      <GridContainer spacing={2} style={{marginTop: 10}}>
        <Grid item xs={12} md={6}>
          {loading ? (
            <LoadingInfo />
          ) : (
            error && <ErrorView message={error.message} />
          )}
        </Grid>
      </GridContainer>

      <GridContainer>
        <InfoView />
      </GridContainer>
    </GridContainer>
  );
};

export default MyApps;
