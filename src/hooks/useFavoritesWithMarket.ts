import { useCallback, useMemo } from 'react';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import { toggleFavoriteCoin } from 'redux/_ui/actions';
import {getTokenById, getTokensById} from 'services/rest/coingecko';
import { Token } from 'types/app';

export function useFavoritesWithMarket() {
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );
  const dispatch = useDispatch();

  const {data, isLoading} = useQuery(
    ['GetFavoriteCoinsData', favoriteCoins],
    async () => {
      if (favoriteCoins) {
        const marketTokens = await getTokensById(
          favoriteCoins.map((f) => f.id),
        );
        if (marketTokens.length > 0) {
          let result = favoriteCoins.map((favorite) => {
            let tokenIndex = marketTokens.findIndex(
              (marketToken) => marketToken.id === favorite.id,
            );

            return {coin: favorite, market: marketTokens[tokenIndex]};
          });
          return result;
        }
        return [];
      }
    },
    {staleTime: 60 * 60},
  );

  const isFavorite = useCallback((token?: {symbol: string}) => {
    if (token) {
      const favorite =  favoriteCoins.find(
        (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
      if(favorite){
        return true;
      }else{
        return false;
      }

    } else {
      return false;
    }
  }, [favoriteCoins]);

  const onToggleFavorite = useCallback((token?: Token, id?: string) => {
    if (token && id) {
      getTokenById(id).then((tokenDetail) => {
        dispatch(toggleFavoriteCoin({...token, ...tokenDetail}));
      });
    }
  },[])

  return {data: data || [], loading: isLoading, onToggleFavorite, isFavorite};
}
