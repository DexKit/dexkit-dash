import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {
  Box,
  Grid,
  ButtonBaseProps,
  ButtonBase,
  makeStyles,
  withStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {useHistory} from 'react-router-dom';

import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as BitcoinConvertIcon} from 'assets/images/icons/bitcoin-convert.svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/icons/slider-horizontal.svg';

function useForceUpdate() {
  const [counter, setUpdate] = useState(false);

  const forceUpdate = useCallback(() => {
    setUpdate((value) => !value);
  }, []);

  return {forceUpdate};
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#2F3142',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderRadius: 20,
    boxShadow: '0px 0px 60px #000000',
    margin: theme.spacing(4),
  },
  container: {
    zIndex: theme.zIndex.speedDial,
    position: 'sticky',
    paddingBottom: theme.spacing(1),
    bottom: 0,
    left: 0,
    right: 0,
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  activeIcon: {
    '& > path': {
      fill: '#FFA552',
    },
  },
}));

const CustomButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}))(ButtonBase);

interface ActionButtonProps extends ButtonBaseProps {
  active: boolean;
}

const ActionButton = (props: ActionButtonProps) => {
  const {active} = props;
  const classes = useStyles();

  return (
    <CustomButton
      className={active ? clsx(classes.active) : undefined}
      {...props}
    />
  );
};

interface AppBottomNavigationProps {}

export const AppBottomNavigation = (props: AppBottomNavigationProps) => {
  const {} = props;

  const {forceUpdate} = useForceUpdate();

  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const history = useHistory();

  const isWallet = useCallback((url: string) => {
    return url.startsWith('/wallet');
  }, []);

  const isTrade = useCallback((url: string) => {
    return url.includes('/token/');
  }, []);

  const isNFTWallet = useCallback((url: string) => {
    return url.startsWith('/nfts/wallet');
  }, []);

  const handleGoWallet = useCallback(() => {
    history.push('/wallet');
    forceUpdate();
  }, [history]);

  const handleGoTrade = useCallback(() => {}, [history]);

  const handleNFTWallet = useCallback(() => {
    history.push('/nfts/wallet');
    forceUpdate();
  }, [history]);

  return isMobile ? (
    <Box className={classes.container}>
      <Box className={classes.root}>
        <Grid container justify='center'>
          <Grid item>
            <ActionButton
              onClick={handleGoWallet}
              active={isWallet(history.location.pathname)}>
              <MoneyWalletIcon
                className={
                  isWallet(history.location.pathname)
                    ? classes.activeIcon
                    : undefined
                }
              />
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton
              onClick={handleGoTrade}
              active={isTrade(history.location.pathname)}>
              <BitcoinConvertIcon
                className={
                  isTrade(history.location.pathname)
                    ? classes.activeIcon
                    : undefined
                }
              />
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton
              onClick={handleNFTWallet}
              active={isNFTWallet(history.location.pathname)}>
              <SliderHorizontalIcon
                className={
                  isNFTWallet(history.location.pathname)
                    ? classes.activeIcon
                    : undefined
                }
              />
            </ActionButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : null;
};

export default AppBottomNavigation;
