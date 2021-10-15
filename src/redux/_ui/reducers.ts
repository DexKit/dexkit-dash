import {Token} from 'types/app';
import {createReducer} from '@reduxjs/toolkit';
import {
  setAccounts,
  setAccount,
  removeAccount,
  addFavoriteCoin,
  removeFavoriteCoin,
  addAccounts,
  toggleFavoriteCoin,
  setDefaultAccount,
  setAccountLabel,
  setUserEncryptedSeed,
  initWallet,
  setShowAccounts,
  toggleWelcomeModal,
  toggleBalancesIsVisible,
  setLoginBackRoute,
} from './actions';
import {CoinDetailCoinGecko} from 'types/coingecko';
import {Network, WalletType, SupportedNetworkType} from 'types/blockchain';

export type FavoriteCoin = Token & CoinDetailCoinGecko;

export type Wallet = {
  [WalletType.evm]: UIAccount[];
  [Network.bitcoin]: UIAccount[];
  [Network.dogecoin]: UIAccount[];
  [Network.cardano]: UIAccount[];
  [Network.dash]: UIAccount[];
  [Network.eos]: UIAccount[];
};

export type UIAccount = {
  address: string;
  label: string;
  networkType: SupportedNetworkType;
};

export interface UIState {
  readonly favoriteCoins: FavoriteCoin[];
  readonly encryptedSeed?: string;
  readonly wallet: Wallet;
  readonly showAccounts: boolean;
  readonly showWelcome: boolean;
  readonly balancesVisible: boolean;
  readonly loginBackRoute?: string;
}

export const WALLET_INIT_STATE: Wallet = {
  [WalletType.evm]: [],
  [Network.bitcoin]: [],
  [Network.dogecoin]: [],
  [Network.cardano]: [],
  [Network.dash]: [],
  [Network.eos]: [],
};

const initialUIState: UIState = {
  favoriteCoins: [],
  wallet: WALLET_INIT_STATE,
  showAccounts: false,
  showWelcome: true,
  balancesVisible: true,
};

export default createReducer(initialUIState, (builder) =>
  builder
    .addCase(initWallet, (state, action) => {
      const {wallet} = action.payload;
      state.wallet = wallet;
    })
    .addCase(setAccounts, (state, action) => {
      const {accounts, type} = action.payload;

      state.wallet[type] = accounts;
    })
    .addCase(setAccount, (state, action) => {
      const {account, type} = action.payload;
      const ind = state.wallet[type].findIndex(
        (a) => a?.address?.toLowerCase() === account?.address?.toLowerCase(),
      );
      if (ind === -1) {
        state.wallet[type].push(account);
      }
    })
    .addCase(setAccountLabel, (state, action) => {
      const {account, type} = action.payload;
      const ind = state.wallet[type].findIndex(
        (a) => a.address.toLowerCase() === account.address.toLowerCase(),
      );
      if (ind !== -1) {
        state.wallet[type][ind] = account;
      }
    })
    .addCase(setDefaultAccount, (state, action) => {
      const {account, type} = action.payload;
      const ind = state.wallet[type].findIndex(
        (a) => a.address.toLowerCase() === account.address.toLowerCase(),
      );
      if (ind === -1) {
        state.wallet[type].unshift(account);
      } else {
        state.wallet[type].splice(ind, 1);
        state.wallet[type].unshift(account);
      }
    })
    .addCase(removeAccount, (state, action) => {
      const {account, type} = action.payload;
      const ind = state.wallet[type].findIndex(
        (a) => a.address?.toLowerCase() === account.address?.toLowerCase(),
      );
      if (ind !== -1) {
        state.wallet[type].splice(ind, 1);
      }
    })
    .addCase(addAccounts, (state, action) => {
      const {accounts, type} = action.payload;
      accounts.forEach((acc) => {
        const ind = state.wallet[type].findIndex(
          (a) => a.address?.toLowerCase() === acc.address?.toLowerCase(),
        );
        if (ind === -1) {
          state.wallet[type].push(acc);
        }
      });
    })
    .addCase(setShowAccounts, (state, action) => {
      let value = action.payload;

      state.showAccounts = value;
    })
    .addCase(removeFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(
        (tk) => tk.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
      if (ind !== -1) {
        state.favoriteCoins.splice(ind, 1);
      }
    })
    .addCase(addFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(
        (tk) => tk.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
      if (ind === -1) {
        state.favoriteCoins.push(token);
      }
    })
    .addCase(toggleFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(
        (tk) => tk.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
      if (ind === -1) {
        state.favoriteCoins.push(token);
      } else {
        state.favoriteCoins.splice(ind, 1);
      }
    })
    .addCase(setUserEncryptedSeed, (state, action) => {
      state.encryptedSeed = action.payload;
    })
    .addCase(toggleWelcomeModal, (state, action) => {
      state.showWelcome = !state.showWelcome;
    })
    .addCase(toggleBalancesIsVisible, (state, action) => {
      state.balancesVisible = !state.balancesVisible;
    })
    .addCase(setLoginBackRoute, (state, action) => {
      state.loginBackRoute = action.payload;
    }),
);
