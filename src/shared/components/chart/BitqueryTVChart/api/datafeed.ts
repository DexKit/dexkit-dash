import axios from 'axios';

import * as Bitquery from './bitquery';
import {EthereumNetwork} from 'shared/constants/AppEnums';

const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
};

const wrappedNative = {
  [EthereumNetwork.ethereum]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [EthereumNetwork.bsc]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [EthereumNetwork.matic]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
};

const native = {
  [EthereumNetwork.ethereum]: 'eth',
  [EthereumNetwork.bsc]: 'bnb',
  [EthereumNetwork.matic]: 'matic',
};
// We are using USDT
const usdReferecence = {
  [EthereumNetwork.ethereum]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  [EthereumNetwork.bsc]: '0x55d398326f99059ff775485246999027b3197955',
  [EthereumNetwork.matic]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
};

export default {
  // This method is used by the Charting Library to get a configuration of your datafeed
  // (e.g. supported resolutions, exchanges and so on)
  onReady(callback: any) {
    setTimeout(() => callback(configurationData));
  },
  // This method is used by the library to retrieve information about a specific symbol
  // (exchange, price scale, full symbol etc.).
  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) {
    const base = symbolName.split(':')[1];
    /*const response = await axios.post(
                    Bitquery.endpoint, {
                        query: Bitquery.GET_COIN_INFO,
                        variables: {
                            "tokenAddress": base,
                            "network": network,
                        },
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-KEY": process.env.REACT_APP_BITQUERY_API_KEY as string
                        }
                    }
                ); 
                
                const coin = response.data.data.ethereum.dexTrades[0].baseCurrency; */

    const symbol = {
      ticker: symbolName,
      name: symbolName,
      description: `${base.toUpperCase()} / USD`,
      session: '24x7',
      timezone: 'Etc/UTC',
      pricescale: 10000000,
      has_intraday: true,
      has_empty_bars: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 1,
      data_status: 'streaming',
    };
    //onSymbolResolvedCallback(symbol);
    onSymbolResolvedCallback(symbol);
  },
  // This method is used by the charting library to get historical data for the symbol.
  async getBars(
    symbolInfo: any,
    resolution: any,
    from: any,
    to: any,
    onHistoryCallback: any,
    onErrorCallback: any,
    first: any,
  ) {
    try {
      if (resolution === '1D' || resolution === 'D') {
        resolution = 1440;
      }
      const network = symbolInfo.ticker.split(':')[0] as
        | EthereumNetwork.bsc
        | EthereumNetwork.matic
        | EthereumNetwork.ethereum;
      const base = symbolInfo.ticker.split(':')[2] || wrappedNative[network];

      // Used when coin is native one
      if (
        base.toLowerCase() === wrappedNative[network].toLowerCase() ||
        native[network] === base.toLowerCase()
      ) {
        const response2 = await axios.post(Bitquery.endpoint, {
          query: Bitquery.GET_COIN_BARS_NATIVE_USDT,
          variables: {
            network: network,
            from: new Date(from * 1000).toISOString(),
            to: new Date(to * 1000).toISOString(),
            interval: Number(resolution),
            wrappedNative: wrappedNative[network],
            usdReference: usdReferecence[network],
          },
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.REACT_APP_BITQUERY_API_KEY as string,
          },
        });
        const bars = response2.data.data.ethereum.dexTrades.map((data: any) => {
          // We find the principal pair and multiply by quotePrice in USD

          return {
            time: Math.floor(new Date(data.timeInterval.minute).getTime()),
            low: data.low,
            high: data.high,
            close: Number(data.close),
            open: Number(data.open),
            volume: data.volume,
          };
        });

        if (bars.length) {
          onHistoryCallback(bars, {noData: false});
        } else {
          onHistoryCallback(bars, {noData: true});
        }
      } else {
        const response2 = await axios.post(Bitquery.endpoint, {
          query: Bitquery.GET_COIN_BARS_USDT,
          variables: {
            network: network,
            from: new Date(from * 1000).toISOString(),
            to: new Date(to * 1000).toISOString(),
            interval: Number(resolution),
            base: base,
            wrappedNative: wrappedNative[network],
            usdReference: usdReferecence[network],
          },
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.REACT_APP_BITQUERY_API_KEY as string,
          },
        });

        const groups = response2.data.data.ethereum.dexTrades.reduce(
          (group: any, el: any) => {
            const date = Math.floor(
              new Date(el.timeInterval.minute).getTime() / 1000,
            );
            if (!group[date]) {
              group[date] = [];
            }
            group[date].push(el);
            return group;
          },
          {},
        );

        const bars = Object.keys(groups)
          .filter((date) => groups[date].length === 2)
          .map((date) => {
            const data = groups[date] as any;
            let quoteAmount;
            let priceRerenceIndex;
            let mainPair;
            let priceUSD;
            // We find the principal pair and multiply by quotePrice in USD
            if (
              data[0].baseCurrency.address.toLowerCase() ===
                base.toLowerCase() &&
              data[0].quoteCurrency.address.toLowerCase() ===
                wrappedNative[network].toLowerCase()
            ) {
              priceRerenceIndex = data[1];
              priceUSD = Number(priceRerenceIndex.close);
              quoteAmount = data[0].volume * priceUSD;
              mainPair = data[0];
            } else {
              priceRerenceIndex = data[0];
              priceUSD = Number(priceRerenceIndex.close);
              quoteAmount = data[1].volume * priceUSD;
              mainPair = data[1];
            }
            return {
              time: Math.floor(new Date(data[0].timeInterval.minute).getTime()),
              low: mainPair.low * priceUSD,
              high: mainPair.high * priceUSD,
              close: Number(mainPair.close) * priceUSD,
              open: Number(mainPair.open) * priceUSD,
              volume: quoteAmount,
            };
          });

        if (bars.length) {
          onHistoryCallback(bars, {noData: false});
        } else {
          onHistoryCallback(bars, {noData: true});
        }
      }
    } catch (err) {
      //  console.log({err})
      // onErrorCallback(err)
    }
  },
  subscribeBars(
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscribeID: any,
    onResetCacheNeededCallback: any,
  ) {},
  unsubscribeBars(subscribeID: any) {},
  searchSymbols(
    userInput: any,
    exchange: any,
    symbolType: any,
    onResultReadyCallback: any,
  ) {
    userInput = userInput.toUpperCase();
    onResultReadyCallback();
  },
};
