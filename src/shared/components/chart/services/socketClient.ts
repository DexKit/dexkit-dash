export default class SocketClient {
  private _path: string;
  baseUrl: string;
  tvIntervals: any;
  lastSocketData: {};
  //@ts-ignore
  private _ws: WebSocket;
  listener: any;
  paramStr: string;
  streams: any;

  constructor(base_url?: string, path?: string) {
    // 'wss://stream.binance.com:9443/ws'
    // 'wss://streamer.cryptocompare.com'
    this.baseUrl = 'wss://stream.binance.com:9443/ws' || base_url;
    this._path = path || '';
    this._createSocket();
    this.tvIntervals = {
      '1': '1m',
      '3': '3m',
      '5': '5m',
      '15': '15m',
      '30': '30m',
      '60': '1h',
      '120': '2h',
      '240': '4h',
      '360': '6h',
      '480': '8h',
      '720': '12h',
      D: '1d',
      '1D': '1d',
      '3D': '3d',
      W: '1w',
      '1W': '1w',
      M: '1M',
      '1M': '1M',
    };
    this.lastSocketData = {};
    this.listener = null;
    this.paramStr = '';
    this.streams = {}; // e.g: {'BTCUSDT': { paramStr: '', data:{}, listener:  } }
  }

  _createSocket() {
    this._ws = new WebSocket(`${this.baseUrl}${this._path}`);
    this._ws.onopen = (e) => {
      console.info(`Binance WS Open`);
    };

    this._ws.onclose = () => {
      console.warn('Binance WS Closed');
    };

    this._ws.onerror = (err) => {
      console.warn('WS Error', err);
    };

    this._ws.onmessage = (msg) => {
      const sData = JSON.parse(msg.data);
      if (sData && sData.k) {
        const {s, E} = sData;
        const {o, h, l, v, c, T, t} = sData.k;
        // Update data
        const lastSocketData = {
          time: t,
          close: parseFloat(c),
          open: parseFloat(o),
          high: parseFloat(h),
          low: parseFloat(l),
          volume: parseFloat(v),
          closeTime: T,
          openTime: t,
        };
        if (this.streams[s] && this.streams[s].data) {
          this.streams[s].data = lastSocketData;
        }
        this.streams[s].listener(lastSocketData);
      }
    };
  }

  subscribeOnStream(
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: any,
    subscribeUID?: string,
    onResetCacheNeededCallback?: any,
    lastDailyBar?: any,
  ) {
    const paramStr = `${symbolInfo.name.toLowerCase()}@kline_${
      this.tvIntervals[resolution]
    }`;
    const obj = {
      method: 'SUBSCRIBE',
      params: [paramStr],
      id: 1,
    };
    if (this._ws.readyState === 1) {
      this._ws.send(JSON.stringify(obj));
      //register multiple streams in streams object
      this.streams[symbolInfo.name] = {
        paramStr,
        listener: onRealtimeCallback,
      };
    }
    this.listener = onRealtimeCallback;
  }

  unsubscribeFromStream(subscriberUID: string) {
    const id = subscriberUID.split('_')[0];
    const obj = {
      method: 'UNSUBSCRIBE',
      params: [this.streams[id].paramStr],
      id: 1,
    };
    delete this.streams[id];
    if (this._ws.readyState === 1) {
      this._ws.send(JSON.stringify(obj));
    }
  }
}
