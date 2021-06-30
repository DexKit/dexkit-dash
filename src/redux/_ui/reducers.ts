import { Token } from "types/app";
import { createReducer } from "@reduxjs/toolkit"
import { setAccounts, setAccount, removeAccount, addFavoriteCoin, removeFavoriteCoin, addAccounts, toggleFavoriteCoin, setDefaultAccount } from "./actions"
import { CoinDetailCoinGecko } from "types/coingecko";

export type FavoriteCoin = Token & CoinDetailCoinGecko

export interface UIState {
    readonly account?: string;
    readonly accounts: string[];
    readonly favoriteCoins: FavoriteCoin[];
}

const initialUIState: UIState = {
    accounts: [],
    favoriteCoins: []
};

export default createReducer(initialUIState, (builder) =>
  builder
    .addCase(setAccounts, (state, action) => {
      state.accounts = action.payload;
 
    })
    .addCase(setAccount, (state, action) => {
      const account = action.payload;
      const ind = state.accounts.findIndex(a => a.toLowerCase() === account.toLowerCase()); 
      if(ind === -1){
        state.accounts.push(account);
      }
    })
    .addCase(setDefaultAccount, (state, action) => {
      const account = action.payload;
      const ind = state.accounts.findIndex(a => a === account); 
      if(ind === -1){
        state.accounts.unshift(account);
      }else{
        state.accounts.splice(ind, 1);
        state.accounts.unshift(account);
      }
    })
    .addCase(removeAccount, (state, action) => {
      const account = action.payload;
      const ind = state.accounts.findIndex(a => a === account); 
      if(ind !== -1){
        state.accounts.splice(ind, 1);
      }
    })
    .addCase(addAccounts, (state, action) => {
      const accounts = action.payload;
      accounts.forEach(acc => {
        const ind = state.accounts.findIndex(a => a === acc); 
        if(ind === -1){
          state.accounts.push(acc);
        }
      })

     
    })
    .addCase(removeFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(tk => tk.symbol.toLowerCase() === token.symbol.toLowerCase()); 
      if(ind !== -1){
        state.favoriteCoins.splice(ind, 1);
      }
    })
    .addCase(addFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(tk => tk.symbol.toLowerCase() === token.symbol.toLowerCase()); 
      if(ind === -1){
        state.favoriteCoins.push(token);
      }
    })
    .addCase(toggleFavoriteCoin, (state, action) => {
      const token = action.payload;
      const ind = state.favoriteCoins.findIndex(tk => tk.symbol.toLowerCase() === token.symbol.toLowerCase()); 
      if(ind === -1){
        state.favoriteCoins.push(token);  
      }else{
        state.favoriteCoins.splice(ind, 1);
      }
    })
    
)
  

