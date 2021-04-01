import Api from '@crema/services/ApiConfig';
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
  GET_NEWS_DATA,
  GET_ACCOUNT_BALANCES,
  GET_TOKEN_BALANCES,
  GET_TOKEN_BALANCES_AT
} from 'types/actions/Dashboard.action';
import { OverviewDataProvider } from 'modules/dashboard/Overview';
import { GetFeed, OverviewDataProviderImp } from 'services/dashboard';
import { getDefiBalances } from 'services/defi-protocols-tokens';
import { getMyTokenBalances, getMyTokenBalancesAt } from 'services/graphql/bitquery';
import { BitqueryAddress } from 'types/bitquery/address.interface';
import { GraphQLError } from 'graphql';
import { MyBalance } from 'types/bitquery/myBalance.interface';


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

export const onGetMyDefiBalances = (address: string) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    getDefiBalances(address)
    .then( balances => {
      dispatch({type: GET_ACCOUNT_BALANCES, payload: balances});
      dispatch(fetchSuccess());
    })
    .catch( e => {
      dispatch(fetchError(e.message));
    })
  }
}

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
  // const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const CORS_PROXY = "";
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

export function onGetMyTokenBalances(network: string, address: string){
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    getMyTokenBalances<{ ethereum: { address: BitqueryAddress[] } }>(network, address)
    .then( balances => {
      if(!balances.loading && balances.data){
        console.log(balances.data.ethereum.address);
        dispatch({type: GET_TOKEN_BALANCES, payload: balances.data.ethereum.address});
        dispatch(fetchSuccess());
      } else if(balances.errors != null && balances.errors.length > 0){
        dispatch(
          fetchError(
            balances.errors.reduce(
              (acu: string, e: GraphQLError) => `${acu}${e.message}; `, ''
            )
          )
        );
      }
      else if(balances.error != null){
        dispatch(fetchError(balances.error?.message));
      }
    })
    .catch( e => {
      dispatch(fetchError(e.message));
    });
  };
}


export function onGetMyTokenBalancesAt(network: string, address: string, days: number){
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());

    const datePromises = [];
    
    const date = new Date();
    const date1 = new Date();

    for(let i = 1; i < days; i++) {
      date.setDate(date.getDate() - 1);
      datePromises.push( getMyTokenBalancesAt<{ ethereum: { address: BitqueryAddress[] } }>(network, address, date) )
    }

    Promise.all(datePromises).then(balances => {
      if(balances && balances.length > 0) {
        let data: BitqueryAddress[] = [];

        for (let item of balances) {
          let balancesAt = item.data.ethereum.address[0].balances as MyBalance[];
         
          const d = balancesAt.reduce((acc: any, obj) => {
            acc[obj.currency.symbol] = obj
            return acc;
          }, []);

          date1.setDate(date1.getDate() - 1);
          data.push({ balances: d, date: date1 });
        }

        dispatch({type: GET_TOKEN_BALANCES_AT, payload: data});
        dispatch(fetchSuccess());
      } else {
        dispatch(fetchError('No assets finded'));
      }
    })
    .catch( e => {
      console.log(e);
      dispatch(fetchError(e.message));
    });
  };
}
