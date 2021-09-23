import transakSDK from '@transak/transak-sdk';
import {useEffect, useCallback, useState} from 'react';
import {useWeb3} from './useWeb3';
import {useWindowSize} from './useWindowSize';

export function useTransak() {
  const windowSize = useWindowSize();

  const {account} = useWeb3();

  const [transakClient, setTransakInstance] = useState<any>();

  const transakAllEvents = useCallback((data: any) => {
    if (data.eventName === 'TRANSAK_WIDGET_CLOSE') {
      const w = window as any;
      if (w) {
        // TODO: remove this
        // workaround to remove annoying css bug
        setTimeout(() => {
          w.document.documentElement.style = 0;
        }, 10);
      }
    }
  }, []);

  const transakCloseEvents = useCallback(
    (data: any) => {
      transakClient?.close();

      // setTransakInstance(undefined);
    },
    [transakClient],
  );

  const transakSucessEvents = useCallback(
    (data: any) => {
      transakClient?.close();
      // setTransakInstance(undefined);
    },
    [transakClient],
  );

  useEffect(() => {
    if ( windowSize && windowSize.height && windowSize.width) {
      const transak: any = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY as string, // Your API Key (Required)
        environment: 'PRODUCTION', // STAGING/PRODUCTION (Required)
        defaultCryptoCurrency: '',
        walletAddress: account ?? '', // Your customer wallet address
        themeColor: '000000', // App theme color in hex
        fiatCurrency: '',
        email: '', // Your customer email address (Optional)
        redirectURL: '',
        hostURL: window.location.origin, // Required field
        widgetHeight:
          windowSize?.height < 650 ? `${windowSize.height - 120}px` : '650px',
        widgetWidth:
          windowSize?.width < 510 ? `${windowSize.width - 10}px` : '500px',
      });

      transak.on(transak.ALL_EVENTS, transakAllEvents);
      transak.on(transak.TRANSAK_WIDGET_CLOSE, transakCloseEvents);
      transak.on(transak.TRANSAK_ORDER_SUCCESSFUL, transakSucessEvents);
      setTransakInstance(transak);
    }
  }, [account, windowSize]);

  const init = useCallback(() => {
    transakClient.init();
  }, [transakClient]);

  return {
    init,
  };
}
