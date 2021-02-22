import Api from '../../@crema/services/ApiConfig';
import {fetchError, fetchStart, fetchSuccess} from './Common';
import {AppActions} from '../../types';
import {Dispatch} from 'redux';
import {
  GET_ANALYTICS_DATA,
  GET_CRM_DATA,
  GET_CRYPTO_DATA,
  GET_METRICS_DATA,
  GET_WIDGETS_DATA,
  GET_REPORT_CARDS_ACTIONS,
  GET_NEWS_DATA
} from '../../types/actions/Dashboard.action';
import { OverviewDataProvider } from 'modules/dashboard/Overview';
import { GetFeed, OverviewDataProviderImp } from 'services/dashboard';

export const onGetAnalyticsData = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/dashboard/analytics')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({type: GET_ANALYTICS_DATA, payload: data.data});
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetCrmData = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/dashboard/crm')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({type: GET_CRM_DATA, payload: data.data});
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetCryptoData = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/dashboard/crypto')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({type: GET_CRYPTO_DATA, payload: data.data});
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetMetricsData = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/dashboard/metrics')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({type: GET_METRICS_DATA, payload: data.data});
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetWidgetsData = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/dashboard/widgets')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({type: GET_WIDGETS_DATA, payload: data.data});
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetReportCardsData = () => {
  const overviewDataProvider: OverviewDataProvider = new OverviewDataProviderImp();
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    overviewDataProvider.getReportCardsData()
    .then( d => {
      dispatch({type: GET_REPORT_CARDS_ACTIONS, payload: d});
      dispatch(fetchSuccess());
    })
    .catch( e => {
      dispatch(fetchError(e.message));
    })
  };
};

export const onGetNewsData = () => {
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const url = new URL(`${CORS_PROXY}https://cointelegraph.com/rss`);
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    GetFeed(url)
    .then( feed => {
      dispatch({type: GET_NEWS_DATA, payload: feed});
      dispatch(fetchSuccess());
    })
    .catch( e => {
      dispatch(fetchError(e.message));
    });
  };
};
