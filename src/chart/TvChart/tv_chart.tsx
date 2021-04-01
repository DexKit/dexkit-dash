import * as React from 'react';
import styled from 'styled-components';

import {
    ChartingLibraryWidgetOptions,
    IChartingLibraryWidget,
    LanguageCode,
    widget,
} from '../charting_library/charting_library.min';
import { TRADE_API_URL, CHAIN_ID } from '../../utils/constants';
import { UDFCompatibleDatafeed } from '../datafeeds/udf/lib/udf-compatible-datafeed';
import { ChainId } from '@types';

const ChartContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px;
`;

export interface ChartContainerProps {
    chainId: ChainId;
    symbol: ChartingLibraryWidgetOptions['symbol'];
    interval: ChartingLibraryWidgetOptions['interval'];

    // BEWARE: no trailing slash is expected in feed URL
    datafeedUrl: string;
    libraryPath: ChartingLibraryWidgetOptions['library_path'];
    chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
    chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
    clientId: ChartingLibraryWidgetOptions['client_id'];
    userId: ChartingLibraryWidgetOptions['user_id'];
    fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
    autosize: ChartingLibraryWidgetOptions['autosize'];
    studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
    containerId: ChartingLibraryWidgetOptions['container_id'];
}

export interface ChartContainerState {
    symbol: string;
    ready: boolean;
}

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    /* eslint-disable */
    const results = regex.exec(location.search);
    return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

// tslint:disable-next-line: no-default-export
export default class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
    public static defaultProps: ChartContainerProps = {
        chainId: CHAIN_ID,
        symbol: 'WETH-DAI',
        interval: 'D',
        containerId: 'tv_chart_container',
        datafeedUrl: `${TRADE_API_URL(CHAIN_ID)}/candles`,
        libraryPath: '/charting_library/',
        chartsStorageUrl: 'https://saveload.tradingview.com',
        chartsStorageApiVersion: '1.1',
        clientId: 'tradingview.com',
        userId: 'dexkit',
        fullscreen: false,
        autosize: true,
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
            // @ts-ignore
            datafeed: new UDFCompatibleDatafeed(`${TRADE_API_URL(this.props.chainId)}/candles`, 60 * 1000),
            interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
            container_id: this.props.containerId as ChartingLibraryWidgetOptions['container_id'],
            library_path: this.props.libraryPath as string,
            timeframe: '3M',
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
                'use_localstorage_for_settings',
                'left_toolbar',
                'context_menus',
                'control_bar',
                'timeframes_toolbar',
            ],
            enabled_features: [],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            studies_overrides: this.props.studiesOverrides,
            theme: 'Dark',
            //custom_css_url: '/charting_library/static/tradingview.css',
        };

        const themeName = 'LIGHT_THEME';
        /*if (themeName === 'DARK_THEME') {
            widgetOptions.theme = 'Dark';
            widgetOptions.overrides = {
                'paneProperties.background': '#111',
            };
        } else*/
        if (themeName === 'LIGHT_THEME') {
            widgetOptions.theme = 'Light';
        }

        const tvWidget = new widget(widgetOptions);
        this._tvWidget = tvWidget;

        // tslint:disable-next-line: no-empty
        tvWidget.onChartReady(() => {
            this.setState({ ready: true });
        });
    }

    public componentWillUnmount(): void {
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
    }

    public componentDidUpdate(): void {
        if (this._tvWidget !== null && this.state.ready) {
            if (this.props.symbol !== this.state.symbol) {
                const symbol = this.props.symbol ? this.props.symbol : 'WETH-DAI';
                if (symbol) {
                    this.setState({ symbol });
                    // tslint:disable-next-line: no-empty
                    this._tvWidget.setSymbol(symbol, 'D', () => {});
                } 
            }
        }
    }

    public render(): JSX.Element {
        return <ChartContainer id={this.props.containerId} />;
    }
}
