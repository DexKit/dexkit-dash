import {createAction} from '@reduxjs/toolkit';
import {Token} from 'types/app';
import { SupportedNetworkType } from 'types/blockchain';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import { UIAccount, Wallet} from './reducers';

export const initWallet = createAction<{wallet: Wallet}>('ui/WALLET_init');

export const setAccounts = createAction<{accounts: UIAccount[], type: SupportedNetworkType}>('ui/ACCOUNTS_set');

export const addAccounts = createAction<{accounts: UIAccount[], type: SupportedNetworkType}>('ui/ACCOUNTS_add');

export const setAccountLabel = createAction<{account: UIAccount, type: SupportedNetworkType}>('ui/ACCOUNT_LABEL_set');

export const setDefaultAccount = createAction<{account: UIAccount, type: SupportedNetworkType}>(
  'ui/ACCOUNTS_set_default',
);

export const setAccount = createAction<{account: UIAccount, type: SupportedNetworkType}>('ui/ACCOUNT_set');

export const setShowAccounts = createAction<boolean>(
  'ui/ACCOUNTS_set_show_accounts',
);

export const removeAccount = createAction<{account: UIAccount, type: SupportedNetworkType}>('ui/ACCOUNT_remove');

type FavoriteCoin = Token & CoinDetailCoinGecko;

export const addFavoriteCoin = createAction<FavoriteCoin>(
  'ui/FAVORITE_COIN_ADD',
);

export const removeFavoriteCoin = createAction<FavoriteCoin>(
  'ui/FAVORITE_COIN_remove',
);

export const toggleFavoriteCoin = createAction<FavoriteCoin>('ui/FAVORITE_COIN_toggle')


export const setUserEncryptedSeed = createAction<string| undefined>('ui/USER_ENCRYPTED_Seed_set')
