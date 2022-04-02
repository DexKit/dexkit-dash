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
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, {useCallback, useState} from 'react';

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
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
    width: theme.spacing(15),
    height: theme.spacing(15),
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '30vw',
  },
  loginBackground: {
    backgroundImage: `url(${LoginBackground})`,
    width: '100%',
    height: '100%',
  },
}));

interface Props {}

export const LoginWallet = (props: Props) => {
  const classes = useStyles();
  const {onConnectMagicEmail, onConnectMagicSocial} = useMagicProvider();
  const isMobile = useMobile();
  const {onConnectWeb3, onCloseWeb3, account} = useWeb3();
  const {loginBackRoute, onSetLoginBackRoute} = useWelcomeModal();
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
    <Box style={{height: '100%'}}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
        <Box pl={2}>
          <Typography variant='body1'>
            <IntlMessages id='app.onBoarding.connectingToWallet' />
          </Typography>
        </Box>
      </Backdrop>
      <Grid container spacing={4} style={{height: '100%'}}>
        {account ? (
          <Grid item xs={12}>
            <Alert severity='info'>
              <Typography variant='body1'>
                <IntlMessages id='app.onBoarding.youAreAlreadyConnected' />{' '}
                <strong>
                  {isMobile && account ? truncateAddress(account) : account}
                </strong>{' '}
                <IntlMessages id='app.onBoarding.accountOn' />{' '}
                <strong>{chainName}</strong>{' '}
                <IntlMessages id='app.onBoarding.network' />
              </Typography>
            </Alert>
          </Grid>
        ) : null}
        <Hidden smUp>
          <Grid item xs={12}>
            <Box className={classes.loginBackground} />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={4}>
          <Box p={{sm: 6, xs: 2}} mt={{sm: 20}}>
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
                      id='app.onBoarding.signIn'
                      defaultMessage={'Sign In'}
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent={'center'}>
                  <Typography variant='body1'>
                    <IntlMessages
                      id='app.onBoarding.orContinue'
                      defaultMessage={'Or continue'}
                    />
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent={'center'}>
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
              <Grid item xs={4}>
                <Divider />
              </Grid>
              <Grid item xs={4} />
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
