import {
  DashboardActionTypes,
  GET_ANALYTICS_DATA,
  GET_CRM_DATA,
  GET_CRYPTO_DATA,
  GET_METRICS_DATA,
  GET_NEWS_DATA,
  GET_REPORT_CARDS_ACTIONS,
  GET_WIDGETS_DATA,
  GET_ACCOUNT_BALANCES,
  GET_TOKEN_BALANCES,
  GET_TOKEN_BALANCES_AT
} from '../../types/actions/Dashboard.action';
import {Metrics} from '../../types/models/Metrics';
import {Analytics} from '../../types/models/Analytics';
import {CRM} from '../../types/models/CRM';
import {Crypto} from '../../types/models/Crypto';
import {Widgets} from '../../types/models/Widgets';
import { ReportCards } from 'types/models/Ecommerce';
import { Feed } from 'types/rss/feed.interface';
import { ProtocolBalanceInterface } from 'defi-sdk/src/protocols/interfaces';
import { BitqueryAddress } from 'types/bitquery/address.interface';


export interface DashboardState {
  analyticsData: Analytics | null;
  crmData: CRM | null;
  cryptoData: Crypto | null;
  metricsData: Metrics | null;
  widgetsData: Widgets | null;
  reportCardsData: ReportCards[];
  newsData: Feed | null;
  accountBalancesData: ProtocolBalanceInterface[];
  myBalances: BitqueryAddress[];
  myBalancesAt: BitqueryAddress[];
}
const initialState: DashboardState = {
  analyticsData: null,
  crmData: null,
  cryptoData: null,
  metricsData: null,
  widgetsData: null,
  reportCardsData: [],
  newsData: null,
  accountBalancesData: [], 
  myBalances: [],
  myBalancesAt: []
};

export default (state = initialState, action: DashboardActionTypes) => {
  switch (action.type) {
    case GET_ANALYTICS_DATA:
      return {
        ...state,
        analyticsData: action.payload,
      };
    case GET_CRM_DATA:
      return {
        ...state,
        crmData: action.payload,
      };

    case GET_CRYPTO_DATA:
      return {
        ...state,
        cryptoData: action.payload,
      };

    case GET_METRICS_DATA:
      return {
        ...state,
        metricsData: action.payload,
      };

    case GET_WIDGETS_DATA:
      return {
        ...state,
        widgetsData: action.payload,
      };
    case GET_REPORT_CARDS_ACTIONS:
      return {
        ...state,
        reportCardsData: action.payload
      };
    case GET_NEWS_DATA:
      return {
        ...state,
        newsData: action.payload
      };
    case GET_ACCOUNT_BALANCES:
      return {
        ...state,
        accountBalancesData: action.payload
      };
    case GET_TOKEN_BALANCES:
      return {
        ...state,
        myBalances: action.payload
      }
    case GET_TOKEN_BALANCES_AT:
      return {
        ...state,
        myBalancesAt: action.payload
      }
    default:
      return state;
  }
};
