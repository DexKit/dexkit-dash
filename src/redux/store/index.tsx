import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import reducers from '../reducers';

import { ActionType } from 'typesafe-actions';

import * as actions from './actions';





const createBrowserHistory = require('history').createBrowserHistory;
const history = createBrowserHistory();
const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

export type RootAction = ActionType<typeof actions>;

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof rootReducer>;

 function configureStore(initialState?: AppState) {
  const middleware = [thunk, routerMiddleware(history)];

  const enhancers = [];
  const windowIfDefined =
    typeof window === 'undefined' ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers),
  );
}

const store = configureStore()

export default store;

export {history};



// export type AppState = ReturnType<typeof rootReducer>;
