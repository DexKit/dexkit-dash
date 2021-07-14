import * as React from 'react';
import styled from 'styled-components';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  widget,
} from '../charting_library/charting_library.min';
import Datafeed from './api/datafeed'; 

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0px;
`;

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  darkMode: boolean;
}

export interface ChartContainerState {
  symbol: string;
  ready: boolean;
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  /* eslint-disable */
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

// tslint:disable-next-line: no-default-export
export default class TVChartContainer extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  public static defaultProps: ChartContainerProps = {
    symbol: 'ethereum:KIT:0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
    interval: '60',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'dexkit',
    fullscreen: false,
    autosize: true,
    darkMode: false,
    studiesOverrides: {},
  };

  public readonly state = {
    symbol: this.props.symbol ? this.props.symbol : 'KIT-WETH',
    ready: false,
  };

  private _tvWidget: IChartingLibraryWidget | null = null;

  public componentDidMount(): void {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this.props.symbol as string,
      datafeed:  Datafeed ,
      interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
      container_id: this.props
        .containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: this.props.libraryPath as string,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings', 'context_menus'],
      enabled_features: [],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      theme: this.props.darkMode ? 'Dark' : 'Light',
      //custom_css_url: '/charting_library/static/tradingview.css',
    };

    if (this.props.darkMode) {
      widgetOptions.overrides = {
        'paneProperties.background': '#181a1f',
      };
    }

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;

    // tslint:disable-next-line: no-empty
    tvWidget.onChartReady(() => {
      this.setState({ready: true});
      tvWidget.chart().setChartType(8);
    });
  }

  public componentWillUnmount(): void {
    if (this._tvWidget !== null) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }
  }

  public componentDidUpdate(prevProps: ChartContainerProps): void {
    if (this._tvWidget !== null && this.state.ready) {
      if (this.props.symbol !== this.state.symbol) {
        const symbol = this.props.symbol ? this.props.symbol : 'WETH-DAI';
        if (symbol) {
          this.setState({symbol});
          // tslint:disable-next-line: no-empty
          this._tvWidget.setSymbol(
            symbol,
            this.props.interval || '60',
            () => {},
          );
        }
      }
      if (this.props.darkMode !== prevProps.darkMode) {
        const theme = this.props.darkMode ? 'Dark' : 'Light';

        this._tvWidget.changeTheme(theme);

        if (this.props.darkMode) {
          this._tvWidget.applyOverrides({
            'paneProperties.background': '#181a1f',
          });
        } else {
          this._tvWidget.applyOverrides({
            'paneProperties.background': '#FFFFFF',
          });
        }
      }
    }
  }

  public render(): JSX.Element {
    return <ChartContainer id={this.props.containerId} />;
  }
}
