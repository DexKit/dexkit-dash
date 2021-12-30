import {
  Box,
  Grid,
  Typography,
  Paper,
  makeStyles,
  ButtonBase,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';

import React, {useCallback, useState} from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  GoogleIcon,
  TwitterIcon,
  ReceiptAddIcon,
  DiscordIcon,
} from 'shared/components/Icons';
import SquaredIconButton from 'shared/components/SquaredIconButton';

import AddIcon from '@material-ui/icons/Add';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {useWeb3} from 'hooks/useWeb3';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
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
    height: theme.spacing(4),
    width: theme.spacing(4),
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
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  walletActionButtonText: {
    textTransform: 'none',
  },
  addressText: {
    fontWeight: 500,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    height: theme.spacing(10),
    width: theme.spacing(10),
  },
}));

interface Props {}

export const CreateWallet = (props: Props) => {
  const classes = useStyles();
  const {onConnectMagicEmail, onConnectMagicSocial} = useMagicProvider();
  const {onConnectWeb3} = useWeb3();

  const handleConnectWeb3 = useCallback(() => onConnectWeb3(), [onConnectWeb3]);

  const [email, setEmail] = useState('');

  //const handleTelegram = useCallback(() => {}, []);

  const handleDiscord = useCallback(() => {
    onConnectMagicSocial('discord');
  }, [onConnectMagicSocial]);

  const handleGoogle = useCallback(() => {
    onConnectMagicSocial('google');
  }, [onConnectMagicSocial]);

  // const handleApple = useCallback(() => {
  //   onConnectMagicSocial('apple');
  // }, [onConnectMagicSocial]);

  const handleTwitter = useCallback(() => {
    onConnectMagicSocial('twitter');
  }, [onConnectMagicSocial]);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleEmail = useCallback(
    (e) => {
      if (email) {
        onConnectMagicEmail(email);
      }
    },
    [email, onConnectMagicEmail],
  );

  const {messages} = useIntl();

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>
                <IntlMessages id='app.onBoarding.loginToDexkitWallet' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>
                <IntlMessages id='app.onBoarding.enterYourEmailBelow' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'}>
                <TextField
                  value={email}
                  onChange={handleChange}
                  label={messages['app.onBoarding.emailExample']}
                  variant='outlined'
                  fullWidth
                />
                <Box marginLeft={2}>
                  <SquaredIconButton onClick={handleEmail}>
                    <AddIcon />
                  </SquaredIconButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                <IntlMessages id='app.onBoarding.orContinueWithOneOfTheSocial' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={4}>
                  <ButtonBase
                    onClick={handleTwitter}
                    className={classes.actionButton}>
                    <Paper
                      className={clsx(
                        classes.actionButtonPaper,
                        classes.actionButtonPaperBorder,
                      )}>
                      <Box
                        display='flex'
                        justifyContent='center'
                        flexDirection='column'
                        py={6}>
                        <Box display='flex' justifyContent='center' py={4}>
                          <Box className={classes.iconContainer}>
                            <TwitterIcon
                              className={classes.walletActionButtonIcon}
                            />
                          </Box>
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='body1'>
                          <IntlMessages id='app.onBoarding.twitter' />
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                {/*<Grid item xs={6} sm={4}>
                  <ButtonBase
                    onClick={handleTelegram}
                    className={classes.actionButton}>
                    <Paper
                      className={clsx(
                        classes.actionButtonPaper,
                        classes.actionButtonPaperBorder,
                      )}>
                      <Box
                        display='flex'
                        justifyContent='center'
                        flexDirection='column'
                        py={6}>
                        <Box display='flex' justifyContent='center' py={4}>
                          <Box className={classes.iconContainer}>
                            <TelegramIcon
                              className={classes.walletActionButtonIcon}
                            />
                          </Box>
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='body1'>
                          Telegram
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                      </Grid>*/}
                {/*<Grid item xs={6} sm={4}>
                  <ButtonBase
                    onClick={handleApple}
                    className={classes.actionButton}>
                    <Paper
                      className={clsx(
                        classes.actionButtonPaper,
                        classes.actionButtonPaperBorder,
                      )}>
                      <Box
                        display='flex'
                        justifyContent='center'
                        flexDirection='column'
                        py={6}>
                        <Box display='flex' justifyContent='center' py={4}>
                          <Box className={classes.iconContainer}>
                            <AppleIcon
                              className={classes.walletActionButtonIcon}
                            />
                          </Box>
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='body1'>
                          Apple
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>*/}
                <Grid item xs={6} sm={4}>
                  <ButtonBase
                    onClick={handleDiscord}
                    className={classes.actionButton}>
                    <Paper
                      className={clsx(
                        classes.actionButtonPaper,
                        classes.actionButtonPaperBorder,
                      )}>
                      <Box
                        display='flex'
                        justifyContent='center'
                        flexDirection='column'
                        py={6}>
                        <Box display='flex' justifyContent='center' py={4}>
                          <Box className={classes.iconContainer}>
                            <DiscordIcon
                              className={classes.walletActionButtonIcon}
                            />
                          </Box>
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='body1'>
                          <IntlMessages id='app.onBoarding.discord' />
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <ButtonBase
                    onClick={handleGoogle}
                    className={classes.actionButton}>
                    <Paper
                      className={clsx(
                        classes.actionButtonPaper,
                        classes.actionButtonPaperBorder,
                      )}>
                      <Box
                        display='flex'
                        justifyContent='center'
                        flexDirection='column'
                        py={6}>
                        <Box display='flex' justifyContent='center' py={4}>
                          <Box className={classes.iconContainer}>
                            <GoogleIcon
                              className={classes.walletActionButtonIcon}
                            />
                          </Box>
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='body1'>
                          <IntlMessages id='app.onBoarding.google' />
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                <IntlMessages id='app.onBoarding.orConnectAnExternalWallet' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ButtonBase
                onClick={handleConnectWeb3}
                className={classes.actionButton}>
                <Paper variant='outlined' className={classes.actionButtonPaper}>
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
                        <Typography variant='body1' style={{fontWeight: 500}}>
                          <IntlMessages id='app.onBoarding.connectTheExternalWallet' />
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <IntlMessages id='app.onBoarding.clickHereToChooseExternal' />
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateWallet;
