import React, {useCallback} from 'react';

import {
  Paper,
  IconButton,
  Grid,
  makeStyles,
  Typography,
  Box,
  Tooltip,
  useTheme,
  Chip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {EthereumNetwork} from 'shared/constants/AppEnums';

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

interface NFTListItemProps {
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

export const NFTListItem = (props: NFTListItemProps) => {
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
      onClick(network, address);
    }
  }, [network, address, onClick]);

  const {usdFormatter} = useUSDFormatter();

  return (
    <Paper onClick={handleClick} className={classes.paper}>
      <Box p={4}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography variant='body1'>{name}</Typography>
              </Grid>
              <Grid item>
                <Tooltip title={name}>
                  <Typography variant='body2'>
                    {symbol.toUpperCase()}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item>
                <Chip
                  size='small'
                  variant='outlined'
                  label={
                    network === EthereumNetwork.ethereum
                      ? 'ETH'
                      : network === 'bsc'
                      ? 'BSC'
                      : network === 'matic'
                      ? 'MATIC'
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography align='right' variant='body1'>
                  {amount.toFixed(0)}
                </Typography>
                {amountUsd ? (
                  <Typography align='right' variant='body2'>
                    {usdFormatter.format(amountUsd)}
                  </Typography>
                ) : null}
              </Grid>
              {dayChange !== undefined ? (
                <Grid item>
                  <Typography
                    align='right'
                    style={{
                      color:
                        dayChange >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                    variant='body2'>
                    {dayChange.toFixed(2)}%
                  </Typography>
                </Grid>
              ) : null}
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

export default NFTListItem;
