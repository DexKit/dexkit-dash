import {useCallback, useState} from 'react';
import {useWeb3} from './useWeb3';
import {useWindowSize} from './useWindowSize';

type Props = {
  defaultCurrency?: string;
};

export function useTransak(props: Props) {
  const {defaultCurrency} = props;
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

  /* eslint-disable */
  const init = useCallback(() => {
    if (transakClient) {
      transakClient.init();
    }else{
      import('@transak/transak-sdk')
      .then(SDK => {
        console.log(SDK)
        //@ts-ignore
          const transak: any = new SDK.default({
            apiKey: process.env.REACT_APP_TRANSAK_API_KEY as string, // Your API Key (Required)
            environment: 'PRODUCTION', // STAGING/PRODUCTION (Required)
            defaultCryptoCurrency: defaultCurrency || '',
            walletAddress: account ?? '', // Your customer wallet address
            themeColor: '000000', // App theme color in hex
            fiatCurrency: '',
            email: '', // Your customer email address (Optional)
            redirectURL: '',
            hostURL: window.location.origin, // Required field
            widgetHeight:
              windowSize && windowSize?.height && windowSize?.height < 650
                ? `${windowSize.height - 120}px`
                : '650px',
            widgetWidth:
              windowSize && windowSize?.width && windowSize?.width < 510
                ? `${windowSize.width - 10}px`
                : '500px',
          });
    
          transak.on(transak.ALL_EVENTS, transakAllEvents);
    
          transak.on(transak.TRANSAK_WIDGET_CLOSE, transakCloseEvents);
    
          transak.on(transak.TRANSAK_ORDER_SUCCESSFUL, transakSucessEvents);
    
          transak.init();
    
          setTransakInstance(transak);
      })
    }
  }, [transakClient, windowSize, defaultCurrency]);

  return {
    init,
  };
}
