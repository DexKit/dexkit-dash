/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Link, BrowserRouter as Router} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {makeStyles} from '@material-ui/core';
import GridContainer from '@crema/core/GridContainer';
import InfoView from '@crema/core/InfoView';
import Alert from '@material-ui/lab/Alert';

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

      <GridContainer spacing={6}>
        <Grid item md={6} xs={12}>
          <BalanceCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <WizardCard />
        </Grid>
      </GridContainer>

      <GridContainer style={{marginTop: 10}} spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h6' style={{fontWeight: 600}}>
            Current Collected Total rewards
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
      </GridContainer>

      <GridContainer
        spacing={6}
        justifyContent='center'
        style={{marginTop: 10}}>
        <Grid item xs={12}>
          <Typography variant='h6' style={{fontWeight: 600}}>
            My Apps
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {!!loading ? (
            <NotFoundAppCard />
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
