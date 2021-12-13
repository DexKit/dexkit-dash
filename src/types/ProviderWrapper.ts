import EventEmitter from 'events';

export const EVENT_EXECUTE = 'execute';
export const EVENT_REQUEST = 'request';
export const EVENT_CANCEL = 'cancel';

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export class ProviderWrapper {
  private _eventEmitter?: EventEmitter;

  constructor(public provider: any, eventEmitter: EventEmitter) {
    this._eventEmitter = eventEmitter;
  }

  async request(args: RequestArguments) {
    if (
      args.method === 'eth_sendTransaction' ||
      args.method === 'eth_sendRawTransaction'
    ) {
      this._eventEmitter?.emit('request', args);
      return new Promise((resolve, reject) => {
        this._eventEmitter?.on('confirm', (newArgs) => {
          resolve(this.provider.request(newArgs));
        });

        this._eventEmitter?.on('cancel', () => {
          reject({message: 'Rejected by the user'});
        });
      });
    }

    return this.provider.request(args);
  }
}
