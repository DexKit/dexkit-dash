import React from 'react';
import {Box, Grid, ButtonBase, makeStyles, withStyles} from '@material-ui/core';

import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as BitcoinConvertIcon} from 'assets/images/icons/bitcoin-convert.svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/icons/slider-horizontal.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#2F3142',
    zIndex: theme.zIndex.speedDial,
    position: 'sticky',
    bottom: theme.spacing(12),
    left: theme.spacing(4),
    right: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderRadius: 20,
    boxShadow: '0px 0px 60px #000000',
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

  return (
    <Box className={classes.root}>
      <Grid container>
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
  );
};

export default AppBottomNavigation;
