import { ConfigFile } from "@types";

export const GET_CONFIG_FILE = 'GET_CONFIG_FILE';
export const SET_CONFIG_FILE = 'SET_CONFIG_FILE';

export interface GetConfigFile{
    type: typeof GET_CONFIG_FILE;
    payload: ConfigFile;
}

export interface SetConfigFile{
    type: typeof SET_CONFIG_FILE;
    payload: ConfigFile;
}

  export type ConfigFileActionTypes =
    GetConfigFile | 
    SetConfigFile;
