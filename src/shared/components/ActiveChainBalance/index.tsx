import React, { useState, useCallback} from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';

import {MyBalances} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
// import {tokenSymbolToDisplayString} from 'utils';

import {truncateAddress} from 'utils';


import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


import {GreenSquare} from '../GreenSquare';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {useAccountsModal} from 'hooks/useAccountsModal';
import { FORMAT_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useActiveChainBalance } from 'hooks/balance/useActiveChainBalance';

const useStyles = makeStyles((theme: CremaTheme) => ({
  greenSquare: {
    backgroundColor: theme.palette.success.main,
    height: theme.spacing(8),
    width: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  usdAmount: {
    fontSize: 32,
    fontWeight: 600,
  },
  usdAmountSign: {
    fontSize: 16,
    fontWeight: 500,
  },
  btnPrimary: {
    color: 'white',
    borderColor: 'white',
    fontFamily: Fonts.BOLD,
    textTransform: 'capitalize',
    width: 106,
    fontSize: 16,
    '&:hover, &:focus': {
      // backgroundColor: theme.palette.primary.dark,
      color: '#F15A2B',
      borderColor: '#F15A2B',
    },
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.modal,
    color: '#fff',
  },
  btnSecondary: {
    color: '#F15A2B',
    borderColor: '#F15A2B',
    fontFamily: Fonts.BOLD,
    textTransform: 'capitalize',
    width: 106,
    fontSize: 16,
    '&:hover, &:focus': {
      // backgroundColor: theme.palette.secondary.dark,
      color: 'white',
      borderColor: 'white',
    },
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
}));



const ActiveChainBalance = () => {
 
  const [amountsVisible, setAmountsVisible] = useState(true);
  const {account, balance, isLoading, network} = useActiveChainBalance();


  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleVisibility = useCallback(() => {
    setAmountsVisible((value) => !value);
  }, []);


  const accountsModal = useAccountsModal();

  const handleShowAccounts = useCallback(() => {
    accountsModal.setShow(true);
  }, [accountsModal]);

  return (
    <>
      <Box>
        <Grid container spacing={2} alignItems='center' justify='space-between'>
          <Grid item xs={isMobile ? 12 : undefined} sm={4}>
            <Paper>
              <Box p={4}>
                <Grid
                  container
                  alignItems='center'
                  justify='space-between'
                  spacing={4}>
                  <Grid item>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <GreenSquare />
                      </Grid>
                      <Grid item>
                        <Typography variant='body2'>
                          <Box display='flex' alignItems='center'>
                            <span>{truncateAddress(account)} </span>
                            <IconButton
                              onClick={handleShowAccounts}
                              size='small'>
                              <KeyboardArrowDownIcon />
                            </IconButton>
                          </Box>
                        </Typography>
                        <Typography className={classes.usdAmount}>
                          {isLoading ? (
                            <Skeleton />
                          ) : !balance ? (
                            `- ${FORMAT_NETWORK_NAME(network)}`
                          ) : (
                            <>
                             {`${balance} ${FORMAT_NETWORK_NAME(network)}`}
                            </>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleToggleVisibility}>
                      {amountsVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ActiveChainBalance;
