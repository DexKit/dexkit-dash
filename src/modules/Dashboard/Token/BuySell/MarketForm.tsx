import React, {useEffect, useState} from 'react';
import {history} from 'redux/store';
import {BigNumber, fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {ethers} from 'ethers';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import {makeStyles, Grid, Box, Button, TextField} from '@material-ui/core';
import {ArrowDownwardOutlined} from '@material-ui/icons';

import {Fonts} from 'shared/constants/AppEnums';

import {CremaTheme} from 'types/AppContextPropsType';
import {OrderSide, Token} from 'types/app';
import SelectToken from './SelectToken';
import {ModalOrderData} from 'types/models/ModalOrderData';
import { useZerox } from 'hooks/useZerox';

interface Props {
  account: string | undefined;
  tokenAddress: string;
  select0: Token[];
  select1: Token[];
  actionButton: (data: ModalOrderData) => void;
}

const MarketForm: React.FC<Props> = (props) => {
  const {
    account,
    tokenAddress,
    select0,
    select1,
    actionButton,
  } = props;

  const useStyles = makeStyles((theme: CremaTheme) => ({
    root: {
      color: theme.palette.secondary.main,
      fontSize: 18,
      marginTop: 6,
      [theme.breakpoints.up('xl')]: {
        fontSize: 20,
        marginTop: 16,
      },
    },
    boxContainer: {
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(9),

      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
      },
    },
    textRes: {
      marginBottom: 0,
      fontSize: 13,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
    },
    inputText: {
      fontFamily: Fonts.MEDIUM,
      width: '100%',
    },
  }));

  const classes = useStyles();

  const {fetchQuote} = useZerox()

  const [target, setTarget] = useState<string>();

  const [inputFrom, setInputFrom] = useState<number>(0);
  const [inputTo, setInputTo] = useState<number>(0);

  const [tokenFrom, setTokenFrom] = useState<Token>();
  const [tokenTo, setTokenTo] = useState<Token>();

  const onFetch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = Number(e.target.value);
    if (tokenFrom && tokenTo) {
      setInputFrom(value);

      console.log('--------------------------------------------------------------');
      console.log(tokenFrom);
      console.log(tokenTo);

      fetchQuote({
        baseToken: tokenFrom,
        quoteToken: tokenTo,
        orderSide: OrderSide.Sell,
        makerAmount: fromTokenUnitAmount(value, tokenFrom.decimals),
        // Parameters used to prevalidate quote at final
        allowedSlippage: new BigNumber(0.5),
        ethAccount: props.account,
        buyTokenPercentage: undefined,
        feeRecipient: undefined,
        affiliateAddress: undefined,
        intentOnFill: false,
      })
        .then((e) => {
          console.log(e);
          setInputTo(toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber());
          setTarget(e.allowanceTarget);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    if (select0 && select1) {
      console.log('aquiii');
      if (tokenFrom == null) {
        const _token = props.select0.find(
          (t) =>
            t.symbol.toUpperCase() === 'ETH' ||
            t.symbol.toUpperCase() === 'WETH',
        );
        setTokenFrom(_token);
        console.log('setTokenFrom', _token);
      }

      if (tokenTo == null) {
        const _token = props.select1.find(
          (t) => t.address.toLowerCase() === props.tokenAddress.toLowerCase(),
        );
        setTokenTo(_token);
        console.log('setTokenTo', _token);
      }
    }
  }, [select0, select1]);

  useEffect(() => {
    if (tokenFrom && tokenTo) {
      if (tokenFrom.name === 'ETH' || tokenFrom.name === 'WETH') {
        console.log(tokenTo.address);
        history.push(tokenTo.address);
      } else {
        console.log(tokenFrom.address);
        history.push(tokenFrom.address);
      }
    }
  }, [tokenFrom, tokenTo]);

  const changeToken = (token: Token | undefined, type: 'from' | 'to') => {
    if (token) {
      if (type === 'from') {
        if (tokenTo && token.address === tokenTo.address) {
          const aux = tokenFrom;
          setTokenFrom(tokenTo);
          setTokenTo(aux);
        } else {
          setTokenFrom(token);
        }
      } else {
        if (tokenFrom && token.address === tokenFrom.address) {
          const aux = tokenTo;
          setTokenTo(tokenFrom);
          setTokenFrom(aux);
        } else {
          setTokenTo(token);
        }
      }
    }
  };

  const handleTrade = () => {
    if (tokenFrom && tokenTo && account && target) {
      actionButton({
        isMarket: true,
        amount: new BigNumber(
          ethers.utils
            .parseUnits(inputFrom.toString(), tokenFrom?.decimals || 18)
            .toString(),
        ),
        token0: tokenFrom,
        token1: tokenTo,
        account: account,
        allowanceTarget: target,
        price: 0,
      });
    }
  };

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box className={classes.boxContainer}>
          <GridContainer>
            <Grid
              style={{paddingTop: 4, paddingRight: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='app.youSend' />}
                onChange={(e) => onFetch(e)}
              />
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingLeft: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <SelectToken
                id={'marketSel0'}
                selected={tokenFrom}
                options={props.select0}
                onChange={($token) => changeToken($token, 'from')}
              />
            </Grid>

            <Grid style={{padding: 0, marginTop: 4}} item xs={12} md={8}>
              <Box
                mb={2}
                color='grey.400'
                textAlign='center'
                className={classes.textRes}>
                {/* <IconButton style={{padding: 0}} > */}
                <ArrowDownwardOutlined />
                {/* </IconButton> */}
              </Box>
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingRight: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='app.youReceive' />}
                value={inputTo}
                disabled
              />
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingLeft: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <SelectToken
                id={'marketSel1'}
                selected={tokenTo}
                options={props.select1}
                onChange={($token) => changeToken($token, 'to')}
              />
            </Grid>
          </GridContainer>
        </Box>
      </form>

      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={handleTrade}>
        Trade
      </Button>
    </Box>
  );
};

export default MarketForm;
