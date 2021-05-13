import { Kit } from "types/models/Kit";
import { Token } from "types/app";

export const GET_ALL_KITS   = 'GET_ALL_KITS';
export const GET_USER_KITS  = 'GET_USER_KITS';
export const GET_ALL_TOKENS = 'GET_ALL_TOKENS';

export interface GetAllKits {
	type: typeof GET_ALL_KITS;
	payload: Kit[];
}

export interface GetUserKits {
	type: typeof GET_USER_KITS;
	payload: Kit[];
}

export interface GetAllTokens {
	type: typeof GET_ALL_TOKENS;
	payload: Token[];
}

export interface ActionCreator {
	type: string;
	payload: any
}

export type MyAppsActions = GetAllKits | GetUserKits | GetAllTokens | ActionCreator;
