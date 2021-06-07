import React, {useEffect, useState} from 'react';
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
import {isNativeCoin, unitsInTokenAmount} from 'utils';
import {Web3State} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
import {useChainId} from 'hooks/useChainId';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {isMobile} from 'web3modal';

interface Props {
  chainId: number | undefined;
  account: string | undefined;
  tokenAddress: string;
  balances: GetMyBalance_ethereum_address_balances[];
  select0: Token[];
  select1: Token[];
  tokenFrom: Token | undefined;
  tokenTo: Token | undefined;
  onChangeToken: (token: Token | undefined, type: 'from' | 'to') => void;
  onTrade: (data: ModalOrderData) => void;
}

const MarketForm: React.FC<Props> = (props) => {
  const {
    chainId,
    account,
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
      color: 'text.primary',
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
        color: 'text.primary',
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
        textDecoration: 'underline',
      },
    },
    inputText: {
      fontFamily: Fonts.MEDIUM,
      width: '100%',
    },
    toText: {
      '&:disabled': {
        color: 'text.primary',
      },
    },
  }));

  const classes = useStyles();

  const {web3State, onConnectWeb3} = useWeb3();

  const network = useNetwork();

  const [
    tokenBalance,
    setTokenBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [allowanceTarget, setAllowanceTarget] = useState<string>();

  if (web3State !== Web3State.Done && tokenFrom === undefined) {
    const tokenETH = select1.find((e) => e.symbol === 'ETH');

    onChangeToken(tokenETH, 'from');
  }

  const resetAmount = () => {
    setAmountFrom(0);
    setAmountTo(0);
  };

  const setMax = () => {
    if (tokenBalance && tokenBalance.value) {
      // If is native coin we not allow user to max all of it, and leave some for gas
      if (isNativeCoin(tokenBalance.currency?.symbol ?? '', chainId ?? 1)) {
        if (tokenBalance?.value > 0.03) {
          setAmountFrom(tokenBalance?.value - 0.03);
          onFetch(tokenBalance?.value - 0.03);
        }
      } else {
        setAmountFrom(tokenBalance?.value ?? 0);
        onFetch(tokenBalance?.value ?? 0);
      }
    }
  };

  useEffect(() => {
    setTokenBalance(
      balances.find((e) => e.currency?.symbol === tokenFrom?.symbol),
    );
  }, [tokenFrom, balances, web3State]);

  const onFetch = (newValue: number | undefined) => {
    setAmountFrom(newValue);

    if (tokenFrom && tokenTo && chainId && newValue) {
      fetchQuote(
        {
          chainId: chainId,
          baseToken: tokenFrom,
          quoteToken: tokenTo,
          orderSide: OrderSide.Sell,
          makerAmount: fromTokenUnitAmount(newValue, tokenFrom.decimals),
          // Parameters used to prevalidate quote at final
          allowedSlippage: 0.03,
          ethAccount: props.account,
          buyTokenPercentage: undefined,
          feeRecipient: undefined,
          affiliateAddress: undefined,
          intentOnFill: false,
        },
        network,
      )
        .then((e) => {
          setAmountTo(toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber());
          setAllowanceTarget(e.allowanceTarget);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onChangeFrom = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    let value = undefined;

    if (e.target.value) {
      value = Number(e.target.value);

      if (value < 0) {
        value = 0;
      }
    }

    onFetch(value);
  };

  const handleTrade = () => {
    if (amountFrom && tokenFrom && tokenTo && account && allowanceTarget) {
      onTrade({
        isMarket: true,
        account: account,
        allowanceTarget: allowanceTarget,
        tokenFrom: tokenFrom,
        tokenTo: tokenTo,
        amountFrom: amountFrom,
        amountTo: amountTo,
        price: 0,
        expiry: 0,
      });
    }
  };

  let errorMessage = null;
  let disabled = false;

  if (web3State !== Web3State.Done) {
    errorMessage = (
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Button
          size='large'
          variant='contained'
          color='primary'
          onClick={onConnectWeb3}
          endIcon={<AccountBalanceWalletIcon />}>
          {web3State === Web3State.Connecting
            ? isMobile()
              ? 'Connecting...'
              : 'Connecting... Check Wallet'
            : isMobile()
            ? 'Connect'
            : 'Connect Wallet'}
        </Button>
      </Box>
    );
    // disabled = true;
  } else if (select0.length === 0) {
    errorMessage = 'No balances found in your wallet';
    disabled = true;
  } else if (!tokenBalance || !tokenBalance.value || tokenBalance.value === 0) {
    errorMessage = 'No available balance for chosen token';
  } else if (amountFrom && tokenBalance.value < amountFrom) {
    errorMessage = 'Insufficient balance for chosen token';
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
                <span onClick={setMax} className={classes.amountTotal}>
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
                value={amountFrom}
                fullWidth
                label={<IntlMessages id='app.youSend' />}
                onChange={(e) => onChangeFrom(e)}
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
                options={web3State === Web3State.Done ? select0 : select1}
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
                className={classes.toText}
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
          (tokenBalance?.value || 0) < (amountFrom || 0) ||
          amountTo === 0 ||
          web3State !== Web3State.Done
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
