import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import transakSDK from '@transak/transak-sdk';
import { useWeb3 } from 'hooks/useWeb3';

interface Props {
}

const Transak: React.FC<Props> = (props) => {

  const {account} = useWeb3();

  const [transakClient, setTransakInstance] = useState<any>();

  const transakAllEvents = useCallback((data: any) => {
    console.log(data);
  }, []);
  
  const transakCloseEvents = useCallback((data: any) => {
    transakClient?.close();
    // setTransakInstance(undefined);
  }, [transakClient]);

  const transakSucessEvents = useCallback((data: any) => {
    transakClient?.close();
    // setTransakInstance(undefined);
  }, [transakClient]);

  useEffect(() => {
    if (account == undefined) {
      setTransakInstance(undefined);
    }
  }, [account]);

  useEffect(() => {
    if(transakClient == undefined && account != null) {
      console.log('new transak');
      const transak: any = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY as string,  // Your API Key (Required)
        environment: 'PRODUCTION', // STAGING/PRODUCTION (Required)
        defaultCryptoCurrency: 'KIT',
        walletAddress: account, // Your customer wallet address
        themeColor: '000000', // App theme color in hex
        fiatCurrency: 'USD',
        email: '', // Your customer email address (Optional)
        redirectURL: '',
        hostURL: window.location.origin, // Required field
        widgetHeight: '550px',
        widgetWidth: '450px'
      });

      transak.on(transak.ALL_EVENTS, transakAllEvents);
      transak.on(transak.TRANSAK_WIDGET_CLOSE, transakCloseEvents);
      transak.on(transak.TRANSAK_ORDER_SUCCESSFUL, transakSucessEvents);
      setTransakInstance(transak);
    }
  }, [account, transakClient]);

  const onBuy = () => {
    if (transakClient) {
      transakClient.init();
    }
  }

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={(e: any) => onBuy()}
      size="small"
      disableElevation
      disabled={transakClient == null}
    >
      Buy
    </Button>
  )
}

export default React.memo(Transak);