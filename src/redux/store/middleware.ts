import { Middleware, MiddlewareAPI, Dispatch, Action } from "redux";
import { AppState } from ".";

const redirectMiddleware: Middleware<{}, AppState> = storeAPI => next => action => {
  const state = storeAPI.getState();
}