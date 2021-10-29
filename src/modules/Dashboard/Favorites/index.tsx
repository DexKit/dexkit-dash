import React, {useCallback} from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {useFavoriteCoinsData} from 'hooks/useFavoriteCoinsData';
import {Link as RouterLink} from 'react-router-dom';

import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import FavoriteCoinsList from './FavoriteCoinsList';
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
    <Box py={{xs: 8}}>
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to={'/wallet'}>
            {messages['app.wallet']}
          </Link>
          <Link color='textSecondary'>{messages['app.favorites']}</Link>
        </Breadcrumbs>
      </Box>
      <Box mb={2} display='flex' alignItems='center' alignContent='center'>
        <Box mr={2}>
          <IconButton size='small' component={RouterLink} to={'/wallet'}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography variant='h5'>{messages['app.favorites']}</Typography>
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
