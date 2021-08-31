import React, {useCallback} from 'react';
import {makeStyles, Typography, Link, Box, Grid} from '@material-ui/core';

import FavoriteItem from './FavoriteItem';
import {FavoriteCoin} from 'redux/_ui/reducers';

import {CoinItemCoinGecko} from 'types/coingecko';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {Link as RouterLink, useHistory} from 'react-router-dom';

const useStyles = makeStyles(() => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
}));

interface FavoriteCoinsListProps {
  favoriteCoins: FavoriteCoin[];
  marketData?: CoinItemCoinGecko[];
  onRemoveCoin?: (coin: FavoriteCoin) => void;
}

const FavoriteCoinsList: React.FC<FavoriteCoinsListProps> = ({
  favoriteCoins,
  marketData,
  onRemoveCoin,
}) => {
  const coinsWithMarketData = favoriteCoins.map((f) => {
    const market = marketData && marketData.find((m) => m.id === f.id);
    return {f, market: market};
  });

  const history = useHistory();

  const handleClick = useCallback((network: string, address: string) => {
    history.push(`/${network}/token/${address}`);
  }, []);

  return (
    <Box>
      <Grid>
        <Grid item xs={12}>
          {coinsWithMarketData.map((row) => (
            <FavoriteItem
              key={row.f.name}
              row={row.f}
              marketData={row.market}
              onRemoveCoin={onRemoveCoin}
              onClick={handleClick}
            />
          ))}
        </Grid>
      </Grid>
      {favoriteCoins && favoriteCoins.length === 0 && (
        <Grid item xs={12}>
          <Typography
            variant='h5'
            display={'block'}
            align={'center'}
            color={'primary'}>
            You don't have favorite coins yet, explore coins on
          </Typography>
          <Typography
            variant='h5'
            display={'block'}
            align={'center'}
            color={'primary'}>
            <Link
              to={`/${EthereumNetwork.ethereum}/token/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`}
              component={RouterLink}>
              Trade page.
            </Link>
          </Typography>
        </Grid>
      )}
    </Box>
  );
};

export default FavoriteCoinsList;
