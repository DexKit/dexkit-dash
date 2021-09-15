import React from 'react';
import {Typography, Link, Box, Grid} from '@material-ui/core';

import {FavoriteCoin} from 'redux/_ui/reducers';

import {CoinItemCoinGecko} from 'types/coingecko';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import FavoriteListItem from 'shared/components/FavoriteListItem';
import {useFavoritesWithMarket} from 'hooks/useFavoritesWithMarket';

import {ReactComponent as EmptyGhost} from 'assets/images/state/empty-ghost.svg';

interface FavoriteCoinsListProps {
  favoriteCoins: FavoriteCoin[];
  marketData?: CoinItemCoinGecko[];
  onRemoveCoin?: (coin: FavoriteCoin) => void;
}

const FavoriteCoinsList: React.FC<FavoriteCoinsListProps> = ({
  favoriteCoins,
}) => {
  const favoritesWithMarket = useFavoritesWithMarket();

  return (
    <Box>
      <Grid container spacing={2}>
        {favoriteCoins && favoriteCoins.length > 0 ? (
          favoritesWithMarket.data.map((favorite, index) => (
            <Grid key={index} item xs={12}>
              <FavoriteListItem
                coin={favorite.coin}
                amount={favorite.market?.current_price || 0}
                dayChange={favorite.market?.price_change_percentage_24h || 0}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              display='flex'
              py={4}
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <EmptyGhost />
            </Box>
            <Typography gutterBottom variant='body1' align='center'>
              You don't have favorites yet.
            </Typography>
            <Typography variant='body2' align='center' color='primary'>
              <Link
                to={`/explorer/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`}
                component={RouterLink}>
                Go to explorer
              </Link>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FavoriteCoinsList;
