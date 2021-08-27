import AppCard from '@crema/core/AppCard';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  IconButton,
} from '@material-ui/core';
import {useFavoriteCoinsData} from 'hooks/useFavoriteCoinsData';
import LoadingTable from 'modules/Common/LoadingTable';
import React, {useCallback} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';

import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import FavoriteCoinsList from './FavoriteCoinsList';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {AboutDialog} from './AboutDialog';
import {Fonts} from 'shared/constants/AppEnums';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {removeFavoriteCoin} from 'redux/_ui/actions';
import {FavoriteCoin} from 'redux/_ui/reducers';
import {TokenListItemSkeleton} from 'shared/components/TokenListItemSkeleton';

export const Favorites = () => {
  const dispatch = useDispatch();

  const {messages} = useIntl();

  const {data, loading} = useFavoriteCoinsData();

  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );

  const handleRemoveCoin = useCallback((coin: FavoriteCoin) => {
    dispatch(removeFavoriteCoin(coin));
  }, []);

  return (
    <Box pt={{xl: 4}}>
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to={'/wallet'}>
            Wallet
          </Link>
          <Link color='textSecondary'>Favorites</Link>
        </Breadcrumbs>
        <Typography variant='h5'>Favorites</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          {favoriteCoins.length > 0 && loading && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
            </Grid>
          )}
          {!loading && (
            <FavoriteCoinsList
              favoriteCoins={favoriteCoins}
              marketData={data}
              onRemoveCoin={handleRemoveCoin}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Favorites;
