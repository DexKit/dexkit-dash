import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Token} from 'types/app';
import {CoinListItemCoingecko} from 'types/coingecko';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {
  getTokenById,
  getTokenCoingeckoItemList,
  getTokens,
} from 'services/rest/coingecko';

type Props = {
  token?: Token;
  // We pass this parameter if needed, but this is optional, as with address we fetch the token detail
  detailToken?: CoinListItemCoingecko;
};

export const FavoriteButton = ({token, detailToken}: Props) => {
  const dispatch = useDispatch();
  const [tk, setTk] = useState<CoinListItemCoingecko | undefined>(detailToken);

  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );
  useEffect(() => {
    const address = token?.address;
    if (address && !detailToken) {
      getTokenCoingeckoItemList(address).then((d) => {
        if (d) {
          setTk(d);
        }
      });
    }
    if (detailToken) {
      setTk(detailToken);
    }
  }, [token, detailToken]);

  const isFavorite = useMemo(() => {
    if (token) {
      return favoriteCoins.find(
        (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
    } else {
      return false;
    }
  }, [favoriteCoins, token]);

  const onToggleFavorite = () => {
    if (token && tk) {
      getTokenById(tk.id).then((tokenDetail) => {
        dispatch(toggleFavoriteCoin({...token, ...tokenDetail}));
      });
    }
  };

  return token && tk ? (
    <Tooltip title='Add to Favorites'>
      <IconButton
        aria-label='add favorite coin'
        color='primary'
        onClick={onToggleFavorite}>
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  ) : null;
};
