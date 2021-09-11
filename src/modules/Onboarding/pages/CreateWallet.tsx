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
  TwitterIcon,
  TelegramIcon,
  AppleIcon,
  DiscordIcon,
} from 'shared/components/Icons';
import Slider from 'shared/components/Slider';
import SquaredIconButton from 'shared/components/SquaredIconButton';

import AddIcon from '@material-ui/icons/Add';

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
  const theme = useTheme();

  const [email, setEmail] = useState('');

  const handleTelegram = useCallback(() => {}, []);

  const handleDiscord = useCallback(() => {}, []);

  const handleGoogle = useCallback(() => {}, []);

  const handleApple = useCallback(() => {}, []);

  const handleTwitter = useCallback(() => {}, []);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>Create Wallet</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>
                Enter your email below to create your wallet.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={email}
                onChange={handleChange}
                label='email@example.com'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Or continue with one of the social networks below:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                          variant='h5'>
                          Google
                        </Typography>
                      </Box>
                    </Paper>
                  </ButtonBase>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateWallet;
