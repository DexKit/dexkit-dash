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
    console.log(args);
    if (
      args.method === 'eth_sendTransaction' ||
      args.method === 'eth_sendRawTransaction'
    ) {
      this._eventEmitter?.emit('request', args);

      return new Promise((resolve, reject) => {
        this._eventEmitter?.on('confirm', (newArgs) => {
          this.provider
            .request(newArgs)
            .then((res: any) => resolve(res))
            .catch((err: any) => reject(err));
        });

        this._eventEmitter?.on('cancel', () => {
          reject({message: 'Rejected by the user'});
        });
      });
    } else if (args.method === 'eth_signTypedData_v4') {
      this._eventEmitter?.emit('sign', args);

      return new Promise((resolve, reject) => {
        this._eventEmitter?.on('sign.confirm', () => {
          this.provider
            .request(args)
            .then((res: any) => resolve(res))
            .catch((err: any) => reject(err));
        });

        this._eventEmitter?.on('sign.cancel', () => {
          reject(new Error('Rejected by the user'));
        });
      });
    }

    return this.provider.request(args);
  }
}
