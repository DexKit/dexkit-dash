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
import {FavoriteCoin} from 'redux/_ui/reducers';
import TokenLogo from './TokenLogo';
import {useHistory} from 'react-router';

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
  },
}));

interface FavoriteListItemProps {
  coin: FavoriteCoin;
  dayChange: number;
  amount: number;
  onClick?: (networkName: EthereumNetwork, address: string) => void;
  onRemove?: () => void;
}

export const FavoriteListItem = (props: FavoriteListItemProps) => {
  const {coin, amount, dayChange, onClick, onRemove} = props;

  const classes = useStyles();
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (onClick !== undefined && coin.networkName !== undefined) {
      onClick(coin.networkName, coin.address);
    }
  }, [coin, onClick]);

  const {usdFormatter} = useUSDFormatter();

  const getIconNetwork = useCallback(() => {
    if (coin.symbol.toUpperCase() === 'ETH') {
      return EthereumNetwork.ethereum;
    } else if (coin.symbol.toUpperCase() === 'BNB') {
      return EthereumNetwork.bsc;
    } else if (coin.symbol.toUpperCase() === 'MATIC') {
      return EthereumNetwork.matic;
    }

    return coin.networkName || EthereumNetwork.ethereum;
  }, [coin]);

  const isNativeCoin = useCallback((coin: any) => {
    if (coin.symbol.toUpperCase() === 'ETH') {
      return true;
    } else if (coin.symbol.toUpperCase() === 'BNB') {
      return true;
    } else if (coin.symbol.toUpperCase() === 'MATIC') {
      return true;
    }

    return false;
  }, []);

  const getExplorerNativeChainURL = useCallback((coin: FavoriteCoin) => {
    if (coin.symbol.toUpperCase() === 'ETH') {
      return `/explorer/eth`;
    } else if (coin.symbol.toUpperCase() === 'BNB') {
      return `/explorer/bnb`;
    } else if (coin.symbol.toUpperCase() === 'MATIC') {
      return `/explorer/matic`;
    }

    return '';
  }, []);

  const getNativeChipLabel = useCallback((coin: FavoriteCoin) => {
    if (coin.symbol.toUpperCase() === 'ETH') {
      return 'ETH';
    } else if (coin.symbol.toUpperCase() === 'BNB') {
      return 'BSC';
    } else if (coin.symbol.toUpperCase() === 'MATIC') {
      return 'MATIC';
    }
  }, []);

  const history = useHistory();

  // TODO: make this code better.
  const handleEthereum = useCallback(() => {
    history.push(
      `/explorer/${coin.platforms?.ethereum}?network=${EthereumNetwork.ethereum}`,
    );
  }, [history, coin]);

  const handleBSC = useCallback(() => {
    history.push(
      `/explorer/${coin.platforms?.['binance-smart-chain']}?network=${EthereumNetwork.bsc}`,
    );
  }, [history, coin]);

  const handlePolygon = useCallback(() => {
    history.push(
      `/explorer/${coin.platforms?.['polygon-pos']}?network=${EthereumNetwork.matic}`,
    );
  }, [history, coin]);

  const handleGoExplorer = useCallback(() => {
    if (isNativeCoin(coin)) {
      history.push(getExplorerNativeChainURL(coin));
    }
  }, [history, coin]);

  return (
    <Paper onClick={handleClick} className={classes.paper}>
      <Box p={4}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Grid container alignItems='center' spacing={2}>
              {getIconNetwork() !== undefined ? (
                <Grid item>
                  <TokenLogo
                    token0={coin.address || ''}
                    networkName={getIconNetwork()}
                  />
                </Grid>
              ) : null}

              <Grid item>
                <Tooltip title={coin.name}>
                  <Typography variant='body2'>
                    {coin.symbol.toUpperCase()}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item>
                <Grid
                  justify='space-between'
                  alignItems='center'
                  alignContent='center'
                  container
                  spacing={2}>
                  {isNativeCoin(coin) ? (
                    <Grid item>
                      <Chip
                        clickable
                        size='small'
                        variant='outlined'
                        label={getNativeChipLabel(coin)}
                        onClick={handleGoExplorer}
                      />
                    </Grid>
                  ) : null}
                  {coin.platforms?.ethereum ? (
                    <Grid item>
                      <Chip
                        clickable
                        size='small'
                        variant='outlined'
                        label='ETH'
                        onClick={handleEthereum}
                      />
                    </Grid>
                  ) : null}
                  {coin.platforms?.['binance-smart-chain'] ? (
                    <Grid item>
                      <Chip
                        clickable
                        size='small'
                        variant='outlined'
                        label='BSC'
                        onClick={handleBSC}
                      />
                    </Grid>
                  ) : null}
                  {coin.platforms?.['polygon-pos'] ? (
                    <Grid item>
                      <Chip
                        clickable
                        size='small'
                        variant='outlined'
                        label='MATIC'
                        onClick={handlePolygon}
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography align='right' variant='body1'>
                  {amount.toFixed(4)}
                </Typography>
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

export default FavoriteListItem;
