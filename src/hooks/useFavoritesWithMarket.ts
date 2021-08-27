import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {FavoriteCoin} from 'redux/_ui/reducers';
import {getTokensById} from 'services/rest/coingecko';
import {CoinItemCoinGecko} from 'types/coingecko';
import {useFavoriteCoinsData} from './useFavoriteCoinsData';

export function useFavoritesWithMarket() {
  const [data, setData] = useState<
    {coin: FavoriteCoin; market: CoinItemCoinGecko}[]
  >([]);
  const [loading, setLoading] = useState(false);

  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );

  useEffect(() => {
    setLoading(true);

    getTokensById(favoriteCoins.map((f) => f.id))
      .then((marketTokens) => {
        if (marketTokens.length > 0) {
          let result = favoriteCoins.map((favorite) => {
            let tokenIndex = marketTokens.findIndex(
              (marketToken) => marketToken.id === favorite.id,
            );

            return {coin: favorite, market: marketTokens[tokenIndex]};
          });

          setData(result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [favoriteCoins]);

  return {data, loading};
}
