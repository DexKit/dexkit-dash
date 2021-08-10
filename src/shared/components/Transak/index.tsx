import React, {useCallback, useEffect, useState} from 'react';
import {Button, ButtonProps, makeStyles} from '@material-ui/core';
import transakSDK from '@transak/transak-sdk';
import {useWeb3} from 'hooks/useWeb3';
import {ReactComponent as Mastercard} from '../../../assets/images/mastercard.svg';
import styled from 'styled-components';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';
import {useWindowSize} from 'hooks/useWindowSize';
import {ReactComponent as CoinIcon} from 'assets/images/icons/coin.svg';

type Props = ButtonProps;

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
  const windowSize = useWindowSize();
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
    if (!transakClient && windowSize && windowSize.height && windowSize.width) {
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
  }, [account, transakClient, windowSize]);

  const onBuy = () => {
    if (transakClient) {
      transakClient.init();
    }
  };

  return (
    <Button
      {...props}
      variant='contained'
      color='primary'
      onClick={(e: any) => onBuy()}
      disabled={!transakClient}
      startIcon={<CoinIcon />}>
      Buy
    </Button>
  );
};

export default React.memo(Transak);
