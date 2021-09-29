import {
  Box,
  Grid,
  Typography,
  Paper,
  makeStyles,
  Button,
  ButtonBase,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, {useCallback, useState} from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  FlashIcon,
  GoogleIcon,
  TwitterIcon,
  ReceiptAddIcon,
  DiscordIcon,
} from 'shared/components/Icons';

import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {useWeb3} from 'hooks/useWeb3';
import {isEmailValid} from 'utils';
import {useMobile} from 'hooks/useMobile';
import {useHistory} from 'react-router-dom';
import {FEE_RECIPIENT} from 'shared/constants/Blockchain';
import {Add as AddIcon} from '@material-ui/icons';
import {useAccountsModal} from 'hooks/useAccountsModal';

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
    color: theme.palette.primary.main,
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  scrollOverflow: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  overflowItem: {
    marginRight: theme.spacing(4),
    '&:last-child': {
      marginRight: 0,
    },
  },
  overflowItemInner: {
    width: '60vw',
  },
}));

interface Props {}

export const CreateWallet = (props: Props) => {
  const classes = useStyles();
  const {onConnectMagicEmail, onConnectMagicSocial} = useMagicProvider();
  const isMobile = useMobile();
  const {onConnectWeb3} = useWeb3();
  const [loading, setLoading] = useState(false);
  const handleConnectWeb3 = useCallback(() => {
    const onConnectSuccess = (a: string) => {
      setLoading(true);
      history.push(`/wallet/${a}`);
    };
    const onFinalConnect = () => {
      setLoading(false);
    };
    onConnectWeb3(onConnectSuccess, onFinalConnect);
  }, []);
  const history = useHistory();
  const [email, setEmail] = useState('');

  //const handleTelegram = useCallback(() => {}, []);

  const toggleLoading = useCallback(() => {
    setLoading((value) => !value);
  }, []);

  const handleDiscord = useCallback(() => {
    setLoading(true);
    onConnectMagicSocial('discord').finally(() => {
      toggleLoading();
    });
  }, []);

  const handleGoogle = useCallback(() => {
    setLoading(true);
    onConnectMagicSocial('google').finally(() => {
      toggleLoading();
    });
  }, []);

  const handleApple = useCallback(() => {
    onConnectMagicSocial('apple').finally(() => {
      toggleLoading();
    });
  }, []);

  const handleTwitter = useCallback(() => {
    setLoading(true);
    onConnectMagicSocial('twitter').finally(() => {
      toggleLoading();
    });
  }, [toggleLoading]);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleEmail = useCallback(
    (e) => {
      if (email) {
        setLoading(true);
        onConnectMagicEmail(email).finally(() => {
          toggleLoading();
        });
      }
    },
    [email],
  );

  const handleConnectWalletLater = useCallback(() => {
    history.push(`/wallet/${FEE_RECIPIENT}`);
  }, []);

  const accountsModal = useAccountsModal();

  const handleToggleAccountsModal = useCallback(() => {
    accountsModal.setShow(!accountsModal.showAccounts);
  }, [accountsModal]);

  return (
    <Box py={{xs: 8}}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
        <Box pl={2}>
          <Typography variant='body1'>Connecting to Wallet...</Typography>
        </Box>
      </Backdrop>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>Login to DexKit Wallet</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>
                Enter your email below to login your wallet.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'}>
                <TextField
                  value={email}
                  onChange={handleChange}
                  label='E-mail'
                  variant='outlined'
                  size='small'
                  error={!isEmailValid(email) && email !== ''}
                  helperText={
                    !isEmailValid(email) && email !== ''
                      ? 'E-mail is not valid'
                      : undefined
                  }
                  fullWidth
                />
                <Box marginLeft={2}>
                  <Button
                    disabled={email === '' || !isEmailValid(email)}
                    variant='contained'
                    onClick={handleEmail}>
                    login
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Or continue with one of the social networks below:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {isMobile ? (
                <Box className={classes.scrollOverflow}>
                  <Box className={classes.overflowItem}>
                    <Box className={classes.overflowItemInner}>
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
                              Twitter
                            </Typography>
                          </Box>
                        </Paper>
                      </ButtonBase>
                    </Box>
                  </Box>
                  <Box className={classes.overflowItem}>
                    <Box className={classes.overflowItemInner}>
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
                              Discord
                            </Typography>
                          </Box>
                        </Paper>
                      </ButtonBase>
                    </Box>
                  </Box>
                  <Box className={classes.overflowItem}>
                    <Box className={classes.overflowItemInner}>
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
                              Google
                            </Typography>
                          </Box>
                        </Paper>
                      </ButtonBase>
                    </Box>
                  </Box>
                  <Box className={classes.overflowItem}>
                    <Box className={classes.overflowItemInner}>
                      <ButtonBase
                        onClick={handleToggleAccountsModal}
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
                                <AddIcon
                                  className={classes.walletActionButtonIcon}
                                />
                              </Box>
                            </Box>
                            <Typography
                              className={classes.walletActionButtonText}
                              align='center'
                              variant='body1'>
                              Add account
                            </Typography>
                          </Box>
                        </Paper>
                      </ButtonBase>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Grid
                  container
                  spacing={4}
                  wrap={isMobile ? 'nowrap' : undefined}>
                  <Grid item xs={12} sm={4}>
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
                            Twitter
                          </Typography>
                        </Box>
                      </Paper>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                            Discord
                          </Typography>
                        </Box>
                      </Paper>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                            Google
                          </Typography>
                        </Box>
                      </Paper>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ButtonBase
                      onClick={handleToggleAccountsModal}
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
                              <AddIcon
                                className={classes.walletActionButtonIcon}
                              />
                            </Box>
                          </Box>
                          <Typography
                            className={classes.walletActionButtonText}
                            align='center'
                            variant='body1'>
                            Add account
                          </Typography>
                        </Box>
                      </Paper>
                    </ButtonBase>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Or connect an external wallet like Metamask
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
                          Connect the external wallet
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          Click here to choose external wallets like Metamask
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
                onClick={handleConnectWalletLater}
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
                          <FlashIcon />
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <Typography variant='body1' style={{fontWeight: 500}}>
                          Connect the wallet later
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          Click here to open the app with a demo wallet.
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
