import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  makeStyles,
  ButtonBase,
} from '@material-ui/core';

import React, {useCallback} from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  FlashIcon,
  WalletCheckPrimaryIcon,
  ReceiptAddIcon,
} from 'shared/components/Icons';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  primaryCard: {
    backgroundColor: '#FCC591',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  primaryCardTitle: {
    fontWeight: 500,
    color: theme.palette.grey[900],
  },
  primaryCardSubtitle: {
    fontWeight: 400,
    color: theme.palette.grey[800],
  },
  iconCircle: {
    backgroundColor: '#FFE3CA',
    borderRadius: '50%',
    display: 'flex',
    width: theme.spacing(10),
    height: theme.spacing(10),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: theme.palette.grey[800],
  },
  boxCircle: {
    borderRadius: '50%',
    backgroundColor: '#3A3D4A',
    display: 'flex',
    width: theme.spacing(10),
    height: theme.spacing(10),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxCircleIcon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  actionButton: {
    width: '100%',
    display: 'block',
    textAlign: 'left',
    borderRadius: theme.shape.borderRadius,
  },
  actionButtonPaper: {
    borderRadius: theme.shape.borderRadius,
  },
  actionButtonPaperBorder: {
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  walletActionButtonIcon: {
    height: theme.spacing(10),
    width: theme.spacing(10),
  },
  walletActionButtonText: {
    textTransform: 'none',
  },
  title: {
    fontWeight: 500,
  },
}));

interface Props {}

export const EmptyWallet = (props: Props) => {
  const classes = useStyles();
  const handleCreatePortifolio = useCallback(() => {}, []);

  const handleConnectWalletLater = useCallback(() => {}, []);

  const handleUseDemoMode = useCallback(() => {}, []);

  return (
    <Box>
      <Grid container justify='center' spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='body1' className={classes.title}>
                    <IntlMessages id='app.onBoarding.howDoYouWantToProceed' />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <ButtonBase
                    onClick={handleCreatePortifolio}
                    className={classes.actionButton}>
                    <Paper className={classes.primaryCard}>
                      <Box p={4}>
                        <Grid
                          container
                          spacing={4}
                          alignItems='center'
                          alignContent='center'>
                          <Grid item>
                            <Box className={classes.iconCircle}>
                              <WalletCheckPrimaryIcon />
                            </Box>
                          </Grid>
                          <Grid item xs>
                            <Typography
                              gutterBottom
                              variant='body1'
                              className={classes.primaryCardTitle}>
                              <IntlMessages id='app.onBoarding.createYourPortfolio' />
                            </Typography>
                            <Typography
                              variant='body2'
                              className={classes.primaryCardSubtitle}>
                              <IntlMessages id='app.onBoarding.clickHereToCreateYour' />
                            </Typography>
                          </Grid>

                          <Grid item>
                            <NavigateNextIcon className={classes.icon} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <ButtonBase
                    onClick={handleConnectWalletLater}
                    className={classes.actionButton}>
                    <Paper
                      variant='outlined'
                      className={classes.actionButtonPaper}>
                      <Box p={4}>
                        <Grid
                          container
                          spacing={2}
                          alignItems='center'
                          alignContent='center'>
                          <Grid item>
                            <Box className={classes.boxCircle}>
                              <ReceiptAddIcon />
                            </Box>
                          </Grid>
                          <Grid item xs>
                            <Typography
                              variant='body1'
                              style={{fontWeight: 500}}>
                              <IntlMessages id='app.onBoarding.connectTheWalletLater' />
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              <IntlMessages id='app.onBoarding.clickHereToAddYourWallet' />
                            </Typography>
                          </Grid>

                          <Grid item>
                            <NavigateNextIcon />
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12}>
                  <ButtonBase
                    onClick={handleUseDemoMode}
                    className={classes.actionButton}>
                    <Paper
                      variant='outlined'
                      className={classes.actionButtonPaper}>
                      <Box p={4}>
                        <Grid
                          container
                          spacing={2}
                          alignItems='center'
                          alignContent='center'>
                          <Grid item>
                            <Box className={classes.boxCircle}>
                              <FlashIcon />
                            </Box>
                          </Grid>
                          <Grid item xs>
                            <Typography
                              variant='body1'
                              style={{fontWeight: 500}}>
                              <IntlMessages id='app.onBoarding.useTheAppInDemoMode' />
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              <IntlMessages id='app.onBoarding.clickHereToOpenADemo' />
                            </Typography>
                          </Grid>

                          <Grid item>
                            <NavigateNextIcon />
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmptyWallet;
