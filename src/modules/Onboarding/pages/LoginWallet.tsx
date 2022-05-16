import {
  Box,
  Grid,
  Typography,
  makeStyles,
  Button,
  ButtonBase,
  TextField,
  lighten,
  Divider,
  Hidden,
  IconButton,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, {useCallback, useContext, useState} from 'react';

import {GoogleIcon, TwitterIcon, DiscordIcon} from 'shared/components/Icons';

import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {useWelcomeModal} from 'hooks/useWelcomeModal';
import {useWeb3} from 'hooks/useWeb3';
import {isEmailValid, truncateAddress} from 'utils';
import {useMobile} from 'hooks/useMobile';
import {useHistory} from 'react-router-dom';
//import {FEE_RECIPIENT} from 'shared/constants/Blockchain';
//import {useAccountsModal} from 'hooks/useAccountsModal';
import {Alert} from '@material-ui/lab';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {useChainInfo} from 'hooks/useChainInfo';
import LoginBackground from 'assets/images/login/background.svg';
import {ReactComponent as DirectBoxSendSymbol} from 'assets/images/vuesax/twotone/directbox-send.svg';
import {ReactComponent as DexKitLogo} from 'assets/images/login/dexkit-logo.svg';
import {WALLET_ROUTE} from 'shared/constants/routes';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {ThemeMode} from 'shared/constants/AppEnums';
import AppContextPropsType from 'types/AppContextPropsType';
import {AppContext} from '@crema';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.grey[800],
  },
  actionButton: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
    width: theme.spacing(17),
    height: theme.spacing(17),
    padding: theme.spacing(1),
    margin: theme.spacing(3),
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: lighten(theme.palette.background.paper, 0.2),
    },
  },
  actionButtonPaper: {
    borderRadius: theme.shape.borderRadius,
  },
  walletActionButtonIcon: {
    color: theme.palette.primary.main,
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  addressText: {
    fontWeight: 500,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.text.primary,
  },
  loginBackground: {
    backgroundImage: `url(${LoginBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%',
  },
  loginBackgroundMobile: {
    backgroundImage: `linear-gradient(180deg, rgba(13, 16, 23, 0) 0%, #0D1017 43.73%), url(${LoginBackground})`,
    width: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    height: '100%',
  },
  logo: {
    '& path': {
      fill: ({themeMode}: {themeMode: any}) =>
        themeMode === ThemeMode.LIGHT
          ? theme.palette.primary.main
          : theme.palette.common.white,
    },
  },
}));

interface Props {}

export const LoginWallet = (props: Props) => {
  const {themeMode} = useContext<AppContextPropsType>(AppContext);

  const classes = useStyles({themeMode});
  const {onConnectMagicEmail, onConnectMagicSocial} = useMagicProvider();
  const isMobile = useMobile();
  const {onConnectWeb3, onCloseWeb3, account} = useWeb3();
  const {loginBackRoute, onSetLoginBackRoute} = useWelcomeModal();
  const defaultAccount = useDefaultAccount();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleConnectWeb3 = useCallback(() => {
    onCloseWeb3();

    const onConnectSuccess = (a: string) => {
      setLoading(true);
      if (loginBackRoute) {
        history.push(loginBackRoute);
        onSetLoginBackRoute(undefined);
      } else {
        history.push(`/wallet/${a}`);
      }
    };
    const onFinalConnect = () => {
      setLoading(false);
    };
    onConnectWeb3(onConnectSuccess, onFinalConnect);
  }, [
    onConnectWeb3,
    onCloseWeb3,
    history,
    onSetLoginBackRoute,
    loginBackRoute,
  ]);

  const [email, setEmail] = useState('');

  //const handleTelegram = useCallback(() => {}, []);

  const toggleLoading = useCallback(() => {
    setLoading((value) => !value);
  }, []);

  const handleDiscord = useCallback(() => {
    onCloseWeb3();
    setLoading(true);
    onConnectMagicSocial('discord').finally(() => {
      toggleLoading();
    });
  }, [onCloseWeb3, onConnectMagicSocial, toggleLoading]);

  const handleGoogle = useCallback(() => {
    onCloseWeb3();
    setLoading(true);
    onConnectMagicSocial('google').finally(() => {
      toggleLoading();
    });
  }, [onCloseWeb3, onConnectMagicSocial, toggleLoading]);

  // const handleApple = useCallback(() => {
  //   onConnectMagicSocial('apple').finally(() => {
  //     toggleLoading();
  //   });
  // }, []);

  const handleTwitter = useCallback(() => {
    onCloseWeb3();
    setLoading(true);
    onConnectMagicSocial('twitter').finally(() => {
      toggleLoading();
    });
  }, [toggleLoading, onConnectMagicSocial, onCloseWeb3]);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleEmail = useCallback(
    (e) => {
      if (email) {
        onCloseWeb3();
        setLoading(true);
        onConnectMagicEmail(email).finally(() => {
          toggleLoading();
        });
      }
    },
    [email, onConnectMagicEmail, onCloseWeb3, toggleLoading],
  );

  const handleBack = useCallback(() => {
    history.push(WALLET_ROUTE);
  }, [history]);

  /*  const handleConnectWalletLater = useCallback(() => {
    history.push(`/wallet/${FEE_RECIPIENT}`);
  }, [history]);*/

  //const accountsModal = useAccountsModal();

  /*const handleToggleAccountsModal = useCallback(() => {
    accountsModal.setShow(!accountsModal.showAccounts);
  }, [accountsModal]);*/

  const {messages} = useIntl();

  const {chainName} = useChainInfo();

  return (
    <Box
      style={{height: '100%', width: '100%'}}
      className={isMobile ? classes.loginBackgroundMobile : undefined}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
        <Box pl={2}>
          <Typography variant='body1'>
            <IntlMessages id='app.onBoarding.connectingToWallet' />
          </Typography>
        </Box>
      </Backdrop>
      <Grid container style={{height: '100%'}}>
        {/* <Hidden smUp>
          <Grid item xs={12}>
            <Box className={classes.loginBackgroundMobile} position='relative'>
              <Box p={2}>
                <DexKitLogo />
              </Box>
              <Box position='absolute' bottom='0px' p={4}>
                <Typography variant='h5'>
                  <IntlMessages id='app.onBoarding.loginToDexkitWallet' />
                </Typography>

                <Typography variant='body2'>
                  <IntlMessages id='app.onBoarding.enterYourEmailBelow' />
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Hidden> */}
        <Hidden smUp>
          <Grid item xs={12}>
            <Box p={6}>
              <DexKitLogo className={classes.logo} />
            </Box>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={4}>
          <Box p={{xs: 6, sm: 20}} my={{xs: 12, sm: 10}}>
            <Grid container spacing={4}>
              {defaultAccount || account ? (
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    alignContent='center'>
                    <Grid item>
                      <IconButton size='small' onClick={handleBack}>
                        <ArrowBackIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>
                        <IntlMessages
                          id='app.onBoarding.goBackToWallet'
                          defaultMessage='Go back to wallet'
                        />{' '}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Box>
                  <Grid container spacing={8}>
                    <Hidden smDown>
                      <Grid item xs={12}>
                        <DexKitLogo className={classes.logo} />
                      </Grid>
                    </Hidden>
                    <Grid item xs={12}>
                      <Typography variant='h6'>
                        <IntlMessages id='app.onBoarding.loginToDexkitWallet' />
                      </Typography>
                      <Typography variant='body2' color={'textSecondary'}>
                        <IntlMessages id='app.onBoarding.enterYourEmailBelow' />
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {false && (
                <Grid item xs={12}>
                  <Alert severity='info' variant='outlined'>
                    <Typography variant='body1'>
                      <IntlMessages id='app.onBoarding.youAreAlreadyConnected' />{' '}
                      <strong>{truncateAddress(account)}</strong>{' '}
                      <IntlMessages id='app.onBoarding.accountOn' />{' '}
                      <strong>{chainName}</strong>{' '}
                      <IntlMessages id='app.onBoarding.network' />
                    </Typography>
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent='center'>
                  <TextField
                    value={email}
                    onChange={handleChange}
                    label={messages['app.onBoarding.eMail']}
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
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent='center'>
                  <Button
                    disabled={email === '' || !isEmailValid(email)}
                    variant='contained'
                    color={'primary'}
                    onClick={handleEmail}
                    endIcon={<DirectBoxSendSymbol />}
                    fullWidth>
                    <IntlMessages
                      id='common.signIn'
                      defaultMessage={'Sign In'}
                    />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display={'flex'} justifyContent={'center'} pt={4}>
                  <Typography variant='body2' color={'textSecondary'}>
                    <IntlMessages
                      id='app.onBoarding.orContinue'
                      defaultMessage={'Or continue'}
                    />
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'} pt={4}>
                  <ButtonBase
                    onClick={handleGoogle}
                    className={classes.actionButton}>
                    <GoogleIcon className={classes.walletActionButtonIcon} />
                  </ButtonBase>

                  <ButtonBase
                    onClick={handleTwitter}
                    className={classes.actionButton}>
                    <TwitterIcon className={classes.walletActionButtonIcon} />
                  </ButtonBase>

                  <ButtonBase
                    onClick={handleDiscord}
                    className={classes.actionButton}>
                    <DiscordIcon className={classes.walletActionButtonIcon} />
                  </ButtonBase>
                </Box>
              </Grid>
              <Grid item xs={4} />
              {!isMobile && (
                <Grid item xs={4}>
                  <Divider />
                </Grid>
              )}

              <Grid item xs={4} />
              {!isMobile && (
                <Grid item xs={12}>
                  <Box display={'flex'} justifyContent={'center'}>
                    <Button
                      variant={'text'}
                      color={'primary'}
                      onClick={handleConnectWeb3}>
                      <IntlMessages
                        id='app.onBoarding.connectExternal'
                        defaultMessage={'Connect External Wallet like Metamask'}
                      />
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
        <Hidden smDown>
          <Grid item sm={8}>
            <Box className={classes.loginBackground} />
          </Grid>
        </Hidden>
      </Grid>
    </Box>
  );
};

export default LoginWallet;
