import {
  DashboardActionTypes,
  GET_ANALYTICS_DATA,
  GET_CRM_DATA,
  GET_CRYPTO_DATA,
  GET_METRICS_DATA,
  GET_NEWS_DATA,
  GET_REPORT_CARDS_ACTIONS,
  GET_WIDGETS_DATA,
} from '../../types/actions/Dashboard.action';
import {Metrics} from '../../types/models/Metrics';
import {Analytics} from '../../types/models/Analytics';
import {CRM} from '../../types/models/CRM';
import {Crypto} from '../../types/models/Crypto';
import {Widgets} from '../../types/models/Widgets';
import { ReportCards } from 'types/models/Ecommerce';
import { Feed } from 'types/rss/feed.interface';

const initialState: {
  analyticsData: Analytics | null;
  crmData: CRM | null;
  cryptoData: Crypto | null;
  metricsData: Metrics | null;
  widgetsData: Widgets | null;
  reportCardsData: ReportCards[];
  newsData: Feed | null;

} = {
  analyticsData: null,
  crmData: null,
  cryptoData: null,
  metricsData: null,
  widgetsData: null,
  reportCardsData: [],
  newsData: null,
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

    default:
      return state;
  }
};
