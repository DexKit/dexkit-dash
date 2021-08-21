import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import reducers from '../reducers';
import {save, load} from 'redux-localstorage-simple';
import {ActionType} from 'typesafe-actions';

import * as actions from '../actions';

const createBrowserHistory = require('history').createBrowserHistory;
const history = createBrowserHistory();
const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

export type RootAction = ActionType<typeof actions>;

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof rootReducer>;

function configureStore() {
  const middleware = [
    thunk,
    routerMiddleware(history),
    save({ignoreStates: ['blockchain']}),
  ];

  const enhancers = [];
  const windowIfDefined =
    typeof window === 'undefined' ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  )(createStore);

  return createStoreWithMiddleware(rootReducer, load());
}

const store = configureStore();

export default store;

export {history};

// export type AppState = ReturnType<typeof rootReducer>;
