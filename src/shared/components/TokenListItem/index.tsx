import React, {useCallback} from 'react';

import {
  Paper,
  IconButton,
  Grid,
  makeStyles,
  Typography,
  Box,
  useTheme,
  Chip,
} from '@material-ui/core';
import TokenLogo from '../TokenLogo';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderRadius: '50%',
  },
  paper: {
    backgroundColor: '#252836',
    borderRadius: 6,
    display: 'block',
    textAlign: 'left',
    cursor: 'pointer',
  },
}));

interface TokenListItemProps {
  symbol: string;
  name: string;
  amount: number;
  amountUsd?: number;
  dayChange?: number;
  address?: string;
  network?: any;
  onClick?: (network: string, address: string) => void;
  onRemove?: () => void;
}

export const TokenListItem = (props: TokenListItemProps) => {
  const {
    symbol,
    name,
    amount,
    dayChange,
    amountUsd,
    address,
    network,
    onClick,
    onRemove,
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (
      onClick !== undefined &&
      address !== undefined &&
      network !== undefined
    ) {
      console.log('aqui 222', network, address);
      onClick(network, address);
    }
  }, [network, address, onClick]);

  console.log('network', name, network);

  return (
    <Paper onClick={handleClick} className={classes.paper}>
      <Box p={4}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <TokenLogo token0={address || ''} networkName={network} />
              </Grid>
              <Grid item>
                <Typography color='textSecondary' variant='caption'>
                  {name}
                </Typography>
                <Typography variant='body2'>
                  {symbol.toUpperCase()}{' '}
                  {<Chip size='small' label={network.toUpperCase()} />}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography align='right' variant='body1'>
                  {amount}
                </Typography>
                {amountUsd ? (
                  <Typography
                    align='right'
                    variant='body2'
                    color='textSecondary'>
                    ${amountUsd.toFixed(2)}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item>
                {dayChange !== undefined ? (
                  <Typography
                    align='right'
                    style={{
                      color:
                        dayChange >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                    variant='body2'>
                    {dayChange}%
                  </Typography>
                ) : null}
              </Grid>
              {onRemove ? (
                <Grid item>
                  <IconButton onClick={onRemove}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TokenListItem;
