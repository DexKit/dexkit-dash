import {createAction} from '@reduxjs/toolkit';
import {Token} from 'types/app';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import {UIAccount} from './reducers';

export const setAccounts = createAction<UIAccount[]>('ui/ACCOUNTS_set');

export const addAccounts = createAction<UIAccount[]>('ui/ACCOUNTS_add');

export const setAccountLabel = createAction<UIAccount>('ui/ACCOUNT_LABEL_set');

export const setDefaultAccount = createAction<UIAccount>(
  'ui/ACCOUNTS_set_default',
);

export const setAccount = createAction<UIAccount>('ui/ACCOUNT_set');

export const removeAccount = createAction<UIAccount>('ui/ACCOUNT_remove');

type FavoriteCoin = Token & CoinDetailCoinGecko;

export const addFavoriteCoin = createAction<FavoriteCoin>(
  'ui/FAVORITE_COIN_ADD',
);

export const removeFavoriteCoin = createAction<FavoriteCoin>(
  'ui/FAVORITE_COIN_remove',
);

export const toggleFavoriteCoin = createAction<FavoriteCoin>(
  'ui/FAVORITE_COIN_toggle',
);
