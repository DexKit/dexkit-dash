import React, {useCallback, useEffect, useState} from 'react';
import {Button, ButtonProps, makeStyles} from '@material-ui/core';
import transakSDK from '@transak/transak-sdk';
import {useWeb3} from 'hooks/useWeb3';
import {ReactComponent as Mastercard} from '../../../assets/images/mastercard.svg';
import styled from 'styled-components';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';

interface Props extends ButtonProps {}

interface StyleProps {
  width: string;
  height: string;
}

interface DefaultProps {
  styles?: StyleProps;
}

const IconContainer = styled.div<DefaultProps>`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 5px 0 5px;

  svg {
    height: ${(props) => props.style?.height};
    width: ${(props) => props.style?.width};
  }
`;

const Transak: React.FC<Props> = (props) => {

  const useStyles = makeStyles((theme: CremaTheme) => ({
    btnPrimary: {
      color: 'white',
      borderColor: 'white',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 106,
      fontSize: 16,
      '&:hover, &:focus': {
        // backgroundColor: theme.palette.primary.dark,
        color: '#F15A2B',
        borderColor: '#F15A2B',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
  }));
  
  const classes = useStyles();


  const {account} = useWeb3();

  const [transakClient, setTransakInstance] = useState<any>();

  const transakAllEvents = useCallback((data: any) => {
    console.log(data);
    if(data.eventName === 'TRANSAK_WIDGET_CLOSE'){
      const w = (window as any)
      if(w){
          // TODO: remove this
          // workaround to remove annoying css bug
          setTimeout(()=>{
              w.document.documentElement.style = 0;   
          }, 10)
      }
    }


  }, []);

  const transakCloseEvents = useCallback(
    (data: any) => {
      console.log('closed')
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
    if (!transakClient) {
      const transak: any = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY as string, // Your API Key (Required)
        environment: 'PRODUCTION', // STAGING/PRODUCTION (Required)
        defaultCryptoCurrency: 'KIT',
        walletAddress: account ?? '', // Your customer wallet address
        themeColor: '000000', // App theme color in hex
        fiatCurrency: 'USD',
        email: '', // Your customer email address (Optional)
        redirectURL: '',
        hostURL: window.location.origin, // Required field
        widgetHeight: '600px',
        widgetWidth: '450px',
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
  };

  return (
    <Button
      variant='outlined'
      onClick={(e: any) => onBuy()}
      size='small'
      disableElevation
      disabled={!transakClient}
      {...props}
      className={classes.btnPrimary}>
      <IconContainer style={{width: '26px', height: '26px'}}>
        <Mastercard />
      </IconContainer>
      Buy
    </Button>
  );
};

export default React.memo(Transak);
