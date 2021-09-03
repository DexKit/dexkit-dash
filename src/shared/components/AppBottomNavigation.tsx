import React from 'react';
import {
  Box,
  Grid,
  ButtonBase,
  makeStyles,
  withStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as BitcoinConvertIcon} from 'assets/images/icons/bitcoin-convert.svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/icons/slider-horizontal.svg';

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
    bottom: 0,
    left: 0,
    right: 0,
  },
}));

const ActionButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}))(ButtonBase);

interface AppBottomNavigationProps {}

export const AppBottomNavigation = (props: AppBottomNavigationProps) => {
  const {} = props;

  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? (
    <Box className={classes.container}>
      <Box className={classes.root}>
        <Grid container justify='center'>
          <Grid item>
            <ActionButton>
              <MoneyWalletIcon />
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton>
              <BitcoinConvertIcon />
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton>
              <SliderHorizontalIcon />
            </ActionButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : null;
};

export default AppBottomNavigation;
