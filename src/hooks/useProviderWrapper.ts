import {EventEmitter} from 'events';
import React, {useState, useCallback, useRef, useEffect} from 'react';

const EVENT_EXECUTE = 'execute';
const EVENT_REQUEST = 'request';
const EVENT_CANCEL = 'cancel';

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

class ProviderWrapper {
  private promise: Promise<any>;

  constructor(public provider: any, public eventEmitter: EventEmitter) {
    this.promise = new Promise((resolve, reject) => {
      eventEmitter.on(EVENT_EXECUTE, (args) => {
        resolve(args);
      });

      eventEmitter.on(EVENT_CANCEL, () => {
        reject({
          message: 'Rejected by the user',
          code: 4001,
        });
      });
    });
  }

  async request(args: RequestArguments) {
    if (args.method === 'eth_sendTransaction') {
      this.eventEmitter.emit(EVENT_REQUEST, args);

      return this.promise.then((args) => {
        return this.provider.request(args);
      });
    }

    return this.provider.request(args);
  }
}

export function useProviderWrapper() {
  const eventsRef = useRef(new EventEmitter());

  const wrapProvider = useCallback((provider: any) => {
    return new ProviderWrapper(provider, eventsRef.current);
  }, []);

  const watch = useCallback((cb: (args: RequestArguments) => void) => {
    return eventsRef.current.on(EVENT_REQUEST, (args) => {
      cb(args);
    });
  }, []);

  const execute = useCallback(() => {
    return eventsRef.current.emit(EVENT_EXECUTE);
  }, []);

  const cancel = useCallback(() => {
    return eventsRef.current.emit(EVENT_CANCEL);
  }, []);

  useEffect(() => {
    return () => {
      eventsRef.current.removeAllListeners();
    };
  }, []);

  return {
    execute,
    cancel,
    wrapProvider,
    watch,
  };
}
