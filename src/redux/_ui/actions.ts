import { createAction } from '@reduxjs/toolkit';
import { Token } from 'types/app';
import { CoinDetailCoinGecko } from 'types/coingecko/coin.interface';



export const setAccounts = createAction<string[]>('ui/ACCOUNTS_set');

export const addAccounts = createAction<string[]>('ui/ACCOUNTS_add');

export const setAccount = createAction<string>('ui/ACCOUNT_set');

export const removeAccount = createAction<string>('ui/ACCOUNT_remove');

type FavoriteCoin = Token & CoinDetailCoinGecko

export const addFavoriteCoin = createAction<FavoriteCoin>('ui/FAVORITE_COIN_ADD')

export const removeFavoriteCoin = createAction<FavoriteCoin>('ui/FAVORITE_COIN_remove')

export const toggleFavoriteCoin = createAction<FavoriteCoin>('ui/FAVORITE_COIN_toggle')