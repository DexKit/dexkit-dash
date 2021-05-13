import { createReducer } from "@reduxjs/toolkit"
import { Token } from "types/app"
import { Kit } from "types/models/Kit"
import { ConfigResponse } from "types/myApps"
import { setAllKits, setAllTokens, setMyAppsConfigs, setUserKits } from "./actions"


interface MyAppsState {
    configs: ConfigResponse[];
    kitsData: Kit[] | null,
  	userKits: Kit[] | null,
  	tokenData: Token[] | null
}


const initialState: MyAppsState = {
    configs: [],
    kitsData: null,
	  userKits: null,
	  tokenData: null
}

export const myAppsReducer = createReducer(initialState, (builder) => {
    builder
      .addCase(setMyAppsConfigs, (state, action) => {
        state.configs = action.payload;
      })
      .addCase(setUserKits, (state, action) => {
        state.userKits = action.payload;
      })
      .addCase(setAllKits, (state, action) => {
        state.kitsData = action.payload;
      })
      .addCase(setAllTokens, (state, action) => {
        state.tokenData = action.payload;
      })
      
  })