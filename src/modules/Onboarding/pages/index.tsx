import {
  Box,
  Grid,
  MobileStepper,
  Typography,
  Divider,
  Paper,
  IconButton,
  makeStyles,
  Button,
  ButtonBase,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import clsx from 'clsx';

import React, {useCallback, useState} from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  FlashIcon,
  WalletCheckPrimaryIcon,
  WalletConnectIcon,
  MetamaskFoxIcon,
  GoogleIcon,
} from 'shared/components/Icons';
import Slider from 'shared/components/Slider';
import SquaredIconButton from 'shared/components/SquaredIconButton';

import AddIcon from '@material-ui/icons/Add';

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
  addressText: {
    fontWeight: 500,
  },
}));

interface Props {}

export const Index = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();

  const [address, setAddress] = useState('');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConnectWalletLater = useCallback(() => {}, []);

  const handleConnectMetamask = useCallback(() => {}, []);

  const handleConnectWalletConnect = useCallback(() => {}, []);

  const handleConnectGoogle = useCallback(() => {}, []);

  const handleCreatePortifolio = useCallback(() => {}, []);

  const handleAddressChange = useCallback((e) => {
    setAddress(e.target.value);
  }, []);

  const handleAddAddress = useCallback(() => {}, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h5'>Welcome</Typography>
        </Grid>
        <Grid item xs={12}>
          <Slider slideCount={2} onNext={() => {}} onPrevious={() => {}}>
            <Box p={4}>
              <Typography variant='h5'>Many other</Typography>
              <Typography variant='h5'>Tools</Typography>
            </Box>
            <Box>2</Box>
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1'>
            Welcome to Super App Dexkit, here you can make your transactions and
            maintenance in the wallet, in addition to several other tools.
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
                      Create your portifolio
                    </Typography>
                    <Typography
                      variant='body2'
                      className={classes.primaryCardSubtitle}>
                      Click here to create your portfolio, quick and easy.
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
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                gutterBottom
                variant='body1'
                className={classes.addressText}>
                Add a wallet address or enter the extensions below.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs>
                  <TextField
                    value={address}
                    onChange={handleAddressChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleAddAddress} size='small'>
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    label='Address'
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1'>
            Or continue with one of the social networks below.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.container}>
            <Box>
              <Grid
                container
                spacing={4}
                wrap={isMobile ? 'nowrap' : undefined}>
                <Grid item xs={12} sm={3}>
                  <ButtonBase
                    onClick={handleConnectMetamask}
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
                          <MetamaskFoxIcon
                            className={classes.walletActionButtonIcon}
                          />
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='h5'>
                          Metamask
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ButtonBase
                    onClick={handleConnectWalletConnect}
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
                          <WalletConnectIcon
                            className={classes.walletActionButtonIcon}
                          />
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='h5'>
                          WalletConnect
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ButtonBase
                    onClick={handleConnectGoogle}
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
                          <GoogleIcon
                            className={classes.walletActionButtonIcon}
                          />
                        </Box>
                        <Typography
                          className={classes.walletActionButtonText}
                          align='center'
                          variant='h5'>
                          Google
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <ButtonBase
            onClick={handleConnectWalletLater}
            className={classes.actionButton}>
            <Paper className={classes.actionButtonPaper}>
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
                      Click here to open the app demo.
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
    </Box>
  );
};

export default Index;
