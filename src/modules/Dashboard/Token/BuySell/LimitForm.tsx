import React, {useEffect, useState} from 'react';
import {BigNumber, fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {useWeb3} from 'hooks/useWeb3';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  makeStyles,
  Grid,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';
import {ArrowDownwardOutlined} from '@material-ui/icons';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {Fonts} from 'shared/constants/AppEnums';

import {CremaTheme} from 'types/AppContextPropsType';
import {OrderSide, Token} from 'types/app';
import SelectToken from './SelectToken';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoin, unitsInTokenAmount} from 'utils';
import {Web3State} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';

interface Props {
  account: string | undefined;
  chainId: number | undefined;
  tokenAddress: string;
  balances: GetMyBalance_ethereum_address_balances[];
  select0: Token[];
  select1: Token[];
  tokenFrom: Token | undefined;
  tokenTo: Token | undefined;
  onChangeToken: (token: Token | undefined, type: 'from' | 'to') => void;
  onTrade: (data: ModalOrderData) => void;
}

const LimitForm: React.FC<Props> = (props) => {
  const {
    account,
    chainId,
    tokenAddress,
    balances,
    select0,
    select1,
    tokenFrom,
    tokenTo,
    onChangeToken,
    onTrade,
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
    amountTotal: {
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline'
      }
    },
    inputText: {
      fontFamily: Fonts.MEDIUM,
      width: '100%',
    },
  }));

  const classes = useStyles();

  const { web3State } = useWeb3();

  const network = useNetwork();

  const [
    tokenBalance,
    setTokenBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [amountTo, setAmountTo] = useState<number>(0);

  const [price, setPrice] = useState<number>(0);

  const [expiryInput, setExpiryInput] = useState<number>(1);
  const [expirySelect, setExpirySelect] = useState<number>(5184000);

  const resetAmount = () => {
    setAmountFrom(0);
    setAmountTo(0);
  }
  const setMax = () => {
    if(tokenBalance && tokenBalance.value){
        // If is native coin we not allow user to max all of it, and leave some for gas
          if(isNativeCoin(tokenBalance.currency?.symbol ?? '', chainId ?? 1)){
            if(tokenBalance?.value > 0.03){
              setAmountFrom(tokenBalance?.value - 0.03);
              setAmountTo((tokenBalance?.value - 0.03) * price);
        
            }
          }else{
            setAmountFrom(tokenBalance?.value ?? 0)
            setAmountTo(tokenBalance?.value  * price);
         } 
     }
  }




  useEffect(() => {
    if (tokenFrom && tokenTo && chainId && account) {
      setTokenBalance(
        balances.find((e) => e.currency?.symbol === tokenFrom?.symbol),
      );

      fetchQuote(
        {
          chainId: chainId,
          baseToken: tokenFrom,
          quoteToken: tokenTo,
          orderSide: OrderSide.Sell,
          makerAmount: fromTokenUnitAmount(1, tokenFrom.decimals),
          allowedSlippage: 0.03,
          ethAccount: account,
          buyTokenPercentage: undefined,
          feeRecipient: undefined,
          affiliateAddress: undefined,
          intentOnFill: false,
        },
        network,
      )
        .then((e) => {
          setPrice(toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber());
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [tokenFrom, tokenTo, chainId, account]);

  const handleTrade = () => {
    if (tokenFrom && tokenTo) {
      onTrade({
        isMarket: false,
        amount: unitsInTokenAmount(
          amountFrom.toString(),
          tokenFrom?.decimals || 18,
        ),
        token0: tokenFrom,
        token1: tokenTo,
        account: 'account',
        allowanceTarget: '',
        price: price,
      });
    }
  };

  const handleInputChange = (event: any) => {
   let value = Number(event.target.value);
   if(value < 0){
     value = 0;
   }

    setAmountFrom(value);
    setAmountTo(value * price);
  };

  const handlePriceChange = (event: any) => {
    
    setPrice(event.target.value);
    setAmountTo(amountFrom * event.target.value);
  };

  const handleExpiryInputChange = (event: any) => {
    setExpiryInput(event.target.value);
  };

  const handleExpirySelectChange = (event: any) => {
    setExpirySelect(event.target.value);
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
            <Grid item xs={12}>
              <Box
                mb={2}
                color='grey.400'
                textAlign='right'
                className={classes.textRes}>
                  <span 
                  onClick={setMax}
                  className={classes.amountTotal}
                  >
                {`$${tokenBalance?.valueInUsd?.toFixed(2) || 0} (${
                  tokenBalance?.value?.toFixed(4) || 0
                } ${tokenBalance?.currency?.symbol || ''})`}
                </span>
              </Box>
            </Grid>
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
                type='number'
                fullWidth
                value={amountFrom}
                label={<IntlMessages id='app.youSend' />}
                onChange={handleInputChange}
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
                options={select0}
                disabled={disabled}
                onChange={($token) => {
                  onChangeToken($token, 'from');
                }}
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
                options={select1}
                disabled={disabled}
                onChange={($token) => {
                  onChangeToken($token, 'to');
                }}
              />
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingRight: 8, paddingBottom: 4}}
              item
              xs={12}
              md={6}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='app.price' />}
                value={price}
                onChange={handlePriceChange}
              />
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingLeft: 8, paddingBottom: 4}}
              item
              xs={12}
              md={3}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='app.expiry' />}
                value={expiryInput}
                onChange={handleExpiryInputChange}
              />
            </Grid>

            <Grid
              style={{paddingTop: 4, paddingLeft: 8, paddingBottom: 4}}
              item
              xs={12}
              md={3}>
              <Select value={expirySelect} onChange={handleExpirySelectChange}>
                <MenuItem value={5184000} selected={true}>
                  Days
                </MenuItem>
                <MenuItem value={3600}>Minutes</MenuItem>
                <MenuItem value={1}>Seconds</MenuItem>
              </Select>
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
          (tokenBalance?.value || 0)  < amountFrom || amountTo === 0
        }>
        <SwapHorizIcon fontSize='large' style={{marginRight: 10}} />
        <Box fontSize='large' fontWeight='bold'>
          Trade
        </Box>
      </Button>
    </Box>
  );
};

export default LimitForm;
