import React from 'react';

import {AppState} from 'redux/store';
import {useSelector} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

import InfoView from '@crema/core/InfoView';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core';

import ErrorView from 'modules/Common/ErrorView';
import {useBalance} from 'hooks/balance/useBalance';
import RewardCard from '../../components/RewardCard';
import WizardCard from '../../components/WizardCard';
import BalanceCard from '../../components/BalanceCard';
import LoadingInfo from 'modules/ProtocolExplorer/Common/InfoToken/LoadingInfo';
import NotFoundAppCard from 'modules/MyApps/components/NotFoundAppCard';
// import { setInsufficientAmountAlert } from 'redux/actions';

type Props = {rewards?: any[]};

const useStyles = makeStyles((theme) => ({
  linkBtn: {
    color: '#fff',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  scrollOverflow: {
    borderRadius: 8,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  overflowItem: {
    borderRadius: '50%',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  },
}));

const rewardsMock = [
  {title: 'Aggregator'},
  {title: 'Marketplace'},
  {title: 'Exchange'},
];

const MyApps: React.FC<Props> = (props) => {
  const classes = useStyles();
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
    <Grid container spacing={2}>
      <Grid container spacing={2}>
        <Grid container>
          <Breadcrumbs
            style={{color: '#fff', fontSize: '0.8rem'}}
            separator='/'>
            <Link
              underline='none'
              component={RouterLink}
              to='/wallet'
              className={classes.linkBtn}>
              <Typography variant='subtitle2'>
                <IntlMessages id='app.myApps.dashboard' />
              </Typography>
            </Link>
            <Typography variant='subtitle2' style={{color: '#2e3243'}}>
              <IntlMessages id='app.myApps.manageApps' />
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid container alignContent='center'>
          <Grid item xs={12} sm={10}>
            <Typography
              variant='h5'
              style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
              <IntlMessages id='app.myApps.manageApps' />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box pb={5}>
        <Alert severity='warning'>
          <IntlMessages id='app.myApps.featureUnderDevelopment' />
        </Alert>
        {insufficientAmountAlert && (
          <Alert severity='warning'>
            <IntlMessages id='app.myApps.youDontHaveTheAmountOfSufficientKit' />
          </Alert>
        )}
      </Box>

      <Grid container spacing={6}>
        <Grid item md={6} xs={12}>
          <BalanceCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <WizardCard />
        </Grid>
      </Grid>

      <Grid container style={{marginTop: 10}} spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h6' style={{fontWeight: 600}}>
            <IntlMessages id='app.myApps.currentCollectedTotalRewards' />
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box className={classes.scrollOverflow}>
                {(props.rewards || rewardsMock).map((reward, i) => (
                  <Box className={classes.overflowItem} key={i}>
                    <RewardCard {...reward} styles={{width: 300}} />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={6}
        justifyContent='center'
        style={{marginTop: 10}}>
        <Grid item xs={12}>
          <Typography variant='h6' style={{fontWeight: 600}}>
            <IntlMessages id='app.myApps.myApps' />
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <LoadingInfo />
          ) : error ? (
            <ErrorView message={error.message} />
          ) : (
            <NotFoundAppCard />
          )}
        </Grid>
      </Grid>

      <Grid container>
        <InfoView />
      </Grid>
    </Grid>
  );
};

export default MyApps;
