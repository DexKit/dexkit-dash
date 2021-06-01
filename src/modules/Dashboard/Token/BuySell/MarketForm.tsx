import React, {useEffect, useState} from 'react';
import {history} from 'redux/store';
import {BigNumber, fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {useWeb3} from 'hooks/useWeb3';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import {makeStyles, Grid, Box, Button, TextField} from '@material-ui/core';
import {ArrowDownwardOutlined} from '@material-ui/icons';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {Fonts} from 'shared/constants/AppEnums';

import {CremaTheme} from 'types/AppContextPropsType';
import {OrderSide, Token} from 'types/app';
import SelectToken from './SelectToken';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {unitsInTokenAmount} from 'utils';
import {Web3State} from 'types/blockchain';
import { useNetwork } from 'hooks/useNetwork';

interface Props {
  account: string | undefined;
  chainId: number | undefined;
  tokenAddress: string;
  balances: GetMyBalance_ethereum_address_balances[];
  select0: Token[];
  select1: Token[];
  actionButton: (data: ModalOrderData) => void;
}

const MarketForm: React.FC<Props> = (props) => {
  const {
    account,
    chainId,
    tokenAddress,
    balances,
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
    btnPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
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

  const {web3State} = useWeb3();

  const [allowanceTarget, setAllowanceTarget] = useState<string>();

  const network = useNetwork();

  const [
    tokenBalance,
    setTokenBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [amountTo, setAmountTo] = useState<number>(0);

  const [tokenFrom, setTokenFrom] = useState<Token>();
  const [tokenTo, setTokenTo] = useState<Token>();

  const onFetch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = Number(e.target.value);

    if (tokenFrom && tokenTo && chainId) {
      setAmountFrom(value);

      console.log(tokenFrom);
      console.log(tokenTo);

      fetchQuote({
        chainId: chainId,
        baseToken: tokenFrom,
        quoteToken: tokenTo,
        orderSide: OrderSide.Sell,
        makerAmount: fromTokenUnitAmount(value, tokenFrom.decimals),
        // Parameters used to prevalidate quote at final
        allowedSlippage: 0.03,
        ethAccount: props.account,
        buyTokenPercentage: undefined,
        feeRecipient: undefined,
        affiliateAddress: undefined,
        intentOnFill: false,
      }, network)
        .then((e) => {
          setAmountTo(
            toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber(),
          );
          setAllowanceTarget(e.allowanceTarget);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    if (select0 && select1) {
      if (tokenFrom == null) {
        const _token = props.select0.find(
          (t) =>
            t.symbol.toUpperCase() === 'ETH' ||
            t.symbol.toUpperCase() === 'WETH',
        );
        setTokenFrom(_token);
        setTokenBalance(
          balances.find((e) => e.currency?.symbol === _token?.symbol),
        );
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
      if (tokenFrom.symbol === 'ETH' || tokenFrom.symbol === 'WETH') {
        if (tokenAddress.toLowerCase() !== tokenTo.address.toLowerCase()) {
          history.push(tokenTo.address);
        }
      } else {
        if (tokenAddress.toLowerCase() !== tokenFrom.address.toLowerCase()) {
          history.push(tokenFrom.address);
        }
      }
    }
  }, [tokenFrom, tokenTo]);

  const changeToken = (token: Token | undefined, type: 'from' | 'to') => {
    if (token) {
      if (type === 'from') {
        if (tokenTo && token.address === tokenTo.address) {
          setTokenBalance(
            balances.find((e) => e.currency?.symbol === tokenTo?.symbol),
          );

          const aux = tokenFrom;
          setTokenFrom(tokenTo);
          setTokenTo(aux);
        } else {
          setTokenBalance(
            balances.find((e) => e.currency?.symbol === token?.symbol),
          );
          setTokenFrom(token);
        }
      } else {
        if (tokenFrom && token.address === tokenFrom.address) {
          setTokenBalance(
            balances.find((e) => e.currency?.symbol === tokenTo?.symbol),
          );

          const aux = tokenTo;
          setTokenTo(tokenFrom);
          setTokenFrom(aux);
        } else {
          setTokenBalance(
            balances.find((e) => e.currency?.symbol === token?.symbol),
          );
          setTokenTo(token);
        }
      }
    }
  };

  const handleTrade = () => {
    if (tokenFrom && tokenTo && account && allowanceTarget) {
      actionButton({
        isMarket: true,
        amount: unitsInTokenAmount(
          amountFrom.toString(),
          tokenFrom?.decimals || 18,
        ),
        token0: tokenFrom,
        token1: tokenTo,
        account: account,
        allowanceTarget: allowanceTarget,
        price: 0,
      });
    }
  };

  let errorMessage = null;
  let disabled = false;

  if (web3State !== Web3State.Done) {
    errorMessage = 'Please connect to your wallet';
    disabled = true;
  } else if (select0.length === 0) {
    errorMessage = 'No balances found in your wallet';
    disabled = true;
  } else if (!tokenBalance || !tokenBalance.value || tokenBalance.value === 0) {
    errorMessage = 'No available balance for chosen token';
  }

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box className={classes.boxContainer}>
          <GridContainer>
            {/* <Grid item xs={12}>
              <Box
                mb={2}
                color='grey.400'
                textAlign='right'
                className={classes.textRes}>
                {`$${tokenBalance?.valueInUsd?.toFixed(2) || 0} (${
                  tokenBalance?.value?.toFixed(4) || 0
                } ${tokenBalance?.currency?.symbol || ''})`}
              </Box>
            </Grid> */}
            {errorMessage && (
              <Grid item xs={12}>
                <Box mb={2} fontSize='large' textAlign='center'>
                  {errorMessage}
                </Box>
              </Grid>
            )}

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
                disabled={disabled}
                onChange={($token) => changeToken($token, 'from')}
              />
            </Grid>

            <Grid style={{padding: 0, marginTop: 4}} item xs={12} md={6}>
              <Grid xs={12}>
                <Box
                  mb={2}
                  color='grey.400'
                  textAlign='center'
                  className={classes.textRes}>
                  <ArrowDownwardOutlined />
                </Box>
              </Grid>
            </Grid>

            <Grid xs={12} md={6} />

            <Grid
              style={{paddingTop: 4, paddingRight: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='app.youReceive' />}
                value={amountTo}
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
                disabled={disabled}
                onChange={($token) => changeToken($token, 'to')}
              />
            </Grid>
          </GridContainer>
        </Box>
      </form>

      <Button
        className={classes.btnPrimary}
        fullWidth
        size='large'
        variant='contained'
        color='primary'
        onClick={handleTrade}
        disabled={
          (tokenBalance?.value || 0) * 0.7 <= amountFrom || amountTo === 0
        }>
        <SwapHorizIcon fontSize='large' style={{marginRight: 10}} />
        <Box fontSize='large' fontWeight='bold'>
          Trade
        </Box>
      </Button>
    </Box>
  );
};

export default MarketForm;
