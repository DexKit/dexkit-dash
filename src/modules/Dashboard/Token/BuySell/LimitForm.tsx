import React, {useEffect, useState} from 'react';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
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
  InputAdornment,
} from '@material-ui/core';
import {ArrowDownwardOutlined} from '@material-ui/icons';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';

import {CremaTheme} from 'types/AppContextPropsType';
import {OrderSide, Token} from 'types/app';
import SelectToken from './SelectToken';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoin, isNativeCoinFromNetworkName} from 'utils';
import {Web3State} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {isMobile} from 'web3modal';
import {
  FORMAT_NETWORK_NAME,
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';

interface Props {
  chainId: number | undefined;
  account: string | undefined;
  tokenAddress: string;
  networkName: EthereumNetwork;
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
    chainId,
    account,
    tokenAddress,
    networkName,
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
      cursor: 'pointer',
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
      '&:hover, &:focus': {
        cursor: 'pointer',
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
  }));

  const classes = useStyles();

  const {web3State, onConnectWeb3} = useWeb3();

  const network = useNetwork();

  const [
    tokenBalance,
    setTokenBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [
    ethBalance,
    setEthBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [expiryInput, setExpiryInput] = useState<number>(1);
  const [expirySelect, setExpirySelect] = useState<number>(86400);
  const [allowanceTarget, setAllowanceTarget] = useState<string>();

  if (web3State !== Web3State.Done && tokenFrom === undefined) {
    const tokenETH = select1.find(
      (e) =>
        (e.symbol.toLowerCase() ===
          GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName) ||
          e.symbol.toLowerCase() ===
            GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(networkName)) &&
        e.symbol.toLowerCase() !== tokenTo?.symbol.toLowerCase(),
    );

    onChangeToken(tokenETH, 'from');
  }

  const resetAmount = () => {
    setAmountFrom(0);
    setAmountTo(0);
  };

  const switchTokens = () => {
    if (tokenFrom) {
      onChangeToken(tokenFrom, 'to');
    }
    if (tokenTo) {
      onChangeToken(tokenTo, 'from');
    }
  };

  const setMax = () => {
    if (tokenBalance && tokenBalance.value) {
      // If is native coin we not allow user to max all of it, and leave some for gas
      if (isNativeCoin(tokenBalance.currency?.symbol ?? '', chainId ?? 1)) {
        if (tokenBalance?.value > 0.03) {
          setAmountFrom(tokenBalance?.value - 0.03);
          setAmountTo((tokenBalance?.value - 0.03) * price);
        }
      } else {
        // Problem: balance comes with 8 decimals (rounded up) from the api
        setAmountFrom(tokenBalance?.value - 0.000000001 ?? 0);
        setAmountTo((tokenBalance?.value - 0.000000001) * price);
      }
    }
  };

  useEffect(() => {
    if (tokenFrom && tokenTo && chainId && account) {
      setTokenBalance(
        balances.find((e) => {
          if (
            tokenFrom?.symbol &&
            isNativeCoinFromNetworkName(tokenFrom?.symbol, networkName)
          ) {
            return (
              e.currency?.symbol?.toLowerCase() ===
              tokenFrom?.symbol.toLowerCase()
            );
          } else {
            return (
              e.currency?.address?.toLowerCase() ===
              tokenFrom?.address.toLowerCase()
            );
          }
        }),
      );

      setEthBalance(
        balances.find(
          (e) =>
            e.currency?.symbol.toLowerCase() ===
            GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toLowerCase(),
        ),
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
          setAllowanceTarget(e.allowanceTarget);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [tokenFrom, tokenTo, chainId, account]);

  const handleTrade = () => {
    if (amountFrom && tokenFrom && tokenTo && account && allowanceTarget) {
      onTrade({
        isMarket: false,
        account: account,
        allowanceTarget: allowanceTarget,
        tokenFrom: tokenFrom,
        tokenTo: tokenTo,
        amountFrom: amountFrom,
        amountTo: amountTo,
        price: price,
        expiry: expiryInput * expirySelect,
      });
    }
  };

  const handleConvert = () => {
    const ethToken = select1.find(
      (t) =>
        t.symbol ===
        GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase(),
    );
    const wethToken = select1.find(
      (t) =>
        t.symbol ===
        GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase(),
    );

    if (ethToken && wethToken && amountFrom && account && allowanceTarget) {
      onTrade({
        isMarket: false,
        account: account,
        allowanceTarget: allowanceTarget,
        tokenFrom: ethToken,
        tokenTo: wethToken,
        amountFrom: amountFrom,
        amountTo: amountFrom,
        price: amountFrom,
        expiry: expiryInput * expirySelect,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    let value = undefined;

    if (e.target.value) {
      value = Number(e.target.value);

      if (value < 0) {
        value = 0;
      }
    }

    setAmountFrom(value);
    setAmountTo((value || 0) * price);
  };

  const handlePriceChange = (event: any) => {
    setPrice(event.target.value);
    setAmountTo((amountFrom || 0) * event.target.value);
  };

  const handleExpiryInputChange = (event: any) => {
    setExpiryInput(event.target.value);
  };

  const handleExpirySelectChange = (event: any) => {
    setExpirySelect(event.target.value);
  };

  let errorMessage = null;
  let disabled = false;

  let notConnected = web3State !== Web3State.Done;

  const connectButton = (
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

 if (select0.length === 0) {
    errorMessage = 'No balances found in your wallet';
    disabled = true;
  } else if (!tokenBalance || !tokenBalance.value || tokenBalance.value === 0) {
    errorMessage = 'No available balance for chosen token';
  } else if (amountFrom && tokenBalance.value < amountFrom) {
    errorMessage = 'Insufficient balance for chosen token';
  } else if (networkName !== network) {
    errorMessage = `Switch to ${FORMAT_NETWORK_NAME(network)} in your wallet`;
  } else if (networkName !== EthereumNetwork.ethereum) {
    errorMessage = `Limit orders are not support on ${FORMAT_NETWORK_NAME(
      network,
    )} yet `;
  }

  const isNative = isNativeCoinFromNetworkName(
    tokenFrom?.symbol ?? '',
    networkName,
  );
  const nativeCoinSymbol = GET_NATIVE_COIN_FROM_NETWORK_NAME(
    networkName,
  ).toUpperCase();
  const wNativeCoinSymbol = GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(
    networkName,
  ).toUpperCase();

  const {priceQuote: priceQuoteTo} = useTokenPriceUSD(
    tokenTo?.address,
    networkName,
    OrderSide.Buy,
    amountTo,
    tokenTo?.decimals,
  );
  const {priceQuote: priceQuoteFrom} = useTokenPriceUSD(
    tokenFrom?.address,
    networkName,
    OrderSide.Sell,
    amountFrom,
    tokenFrom?.decimals,
  );

  const {usdFormatter} = useUSDFormatter();

  return (
    <>
      {networkName !== EthereumNetwork.ethereum && (
        <Box>
          <Box className={classes.boxContainer}>
            <GridContainer>
              <Grid item xs={12}>
                <Box mb={2} fontSize='large' textAlign='center'>
                  Limit orders are only supported on{' '}
                  {FORMAT_NETWORK_NAME(EthereumNetwork.ethereum)} Network for
                  now
                </Box>
              </Grid>
            </GridContainer>
          </Box>
        </Box>
      )}

      {networkName == EthereumNetwork.ethereum && (
        <Box>
          <form noValidate autoComplete='off'>
            <Box className={classes.boxContainer}>
              <GridContainer>
                {isNative && (
                  <Grid item xs={12}>
                    <Box mb={2} fontSize='large' textAlign='center'>
                      To use Limit orders you need to wrap your{' '}
                      {nativeCoinSymbol} to {wNativeCoinSymbol}, and use{' '}
                      {wNativeCoinSymbol} to place limit orders
                    </Box>
                  </Grid>
                )}
                {account && (
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position='end'
                          style={{fontSize: '13px'}}>
                          {priceQuoteFrom && (
                            <>
                              ≈
                              <i>
                                {' '}
                                {usdFormatter.format(
                                  Number(priceQuoteFrom?.price) *
                                    Number(amountFrom),
                                )}
                              </i>
                            </>
                          )}
                        </InputAdornment>
                      ),
                    }}
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
                    label={select0 && 'Your Coins'}
                    limitCoins={select0 ? true : false}
                    options={web3State === Web3State.Done ? select0 : select1}
                    disabled={disabled}
                    onChange={($token) => {
                      onChangeToken($token, 'from');
                    }}
                  />
                </Grid>

                {!isNative && (
                  <>
                    <Grid
                      style={{padding: 0, marginTop: 4}}
                      item
                      xs={12}
                      md={6}>
                      <Box
                        mb={2}
                        color='grey.400'
                        textAlign='center'
                        onClick={() => switchTokens()}
                        className={classes.textRes}>
                        <ArrowDownwardOutlined />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6} />

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
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment
                              position='end'
                              style={{fontSize: '13px'}}>
                              {priceQuoteTo && (
                                <>
                                  ≈
                                  <i>
                                    {' '}
                                    {usdFormatter.format(
                                      Number(priceQuoteTo?.price) *
                                        Number(amountTo),
                                    )}
                                  </i>
                                </>
                              )}
                            </InputAdornment>
                          ),
                        }}
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
                      style={{paddingTop: 8, paddingRight: 8, paddingBottom: 4}}
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
                      style={{paddingTop: 10, paddingLeft: 8, paddingBottom: 4}}
                      item
                      xs={6}
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
                      style={{paddingTop: 10, paddingLeft: 8, paddingBottom: 4}}
                      item
                      xs={6}
                      md={3}>
                      <Box
                        style={{height: '100%'}}
                        display='flex'
                        justifyContent='center'>
                        <Select
                          value={expirySelect}
                          onChange={handleExpirySelectChange}>
                          <MenuItem value={86400} selected={true}>
                            Days
                          </MenuItem>
                          <MenuItem value={60}>Minutes</MenuItem>
                          <MenuItem value={1}>Seconds</MenuItem>
                        </Select>
                      </Box>
                    </Grid>
                  </>
                )}
                <Grid xs={12} md={12}>
                  <Box display={'flex'} justifyContent={'space-evenly'}>
                    {priceQuoteTo && (
                      <Box>
                        <p>
                          1 {tokenTo?.symbol.toUpperCase()}{' '}
                          {priceQuoteTo && (
                            <>
                              ≈
                              <i>
                                {' '}
                                {usdFormatter.format(
                                  Number(priceQuoteTo?.price),
                                )}
                              </i>
                            </>
                          )}
                        </p>
                      </Box>
                    )}
                    {priceQuoteFrom && (
                      <Box>
                        <p>
                          1 {tokenFrom?.symbol.toUpperCase()}{' '}
                          {priceQuoteFrom && (
                            <>
                              ≈
                              <i>
                                {' '}
                                {usdFormatter.format(
                                  Number(priceQuoteFrom?.price),
                                )}
                              </i>
                            </>
                          )}
                        </p>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </GridContainer>
            </Box>
          </form>

          {!notConnected &&  <GridContainer>
            {isNative && (
              <Grid style={{paddingRight: 8}} item xs={12} sm={12}>
                <Button
                  className={classes.btnPrimary}
                  fullWidth
                  size='large'
                  variant='contained'
                  color='primary'
                  onClick={handleConvert}
                  disabled={
                    (ethBalance?.value || 0) < (amountFrom || 0) ||
                    !!errorMessage ||
                    amountTo === 0 ||
                    web3State !== Web3State.Done
                  }>
                  <Box fontSize='large' fontWeight='bold'>
                    Convert {nativeCoinSymbol} -{`>`} {wNativeCoinSymbol}
                  </Box>
                </Button>
              </Grid>
            )}
            {!isNative && (
              <Grid style={{paddingLeft: 8}} item xs={12} sm={12}>
                <Button
                  className={classes.btnPrimary}
                  fullWidth
                  size='large'
                  variant='contained'
                  color='primary'
                  onClick={handleTrade}
                  disabled={
                    (tokenBalance?.value || 0) < (amountFrom || 0) ||
                    !!errorMessage ||
                    amountTo === 0 ||
                    web3State !== Web3State.Done
                  }>
                  {errorMessage && account ? (
                    errorMessage
                  ) : (
                    <>
                      <SwapHorizIcon
                        fontSize='large'
                        style={{marginRight: 10}}
                      />
                      <Box fontSize='large' fontWeight='bold'>
                        Trade
                      </Box>
                    </>
                  )}
                </Button>
              </Grid>
            )}
          </GridContainer>}
          {notConnected &&  <GridContainer>
            <Grid style={{paddingLeft: 8}} item xs={12} sm={12}>
           { connectButton}
            </Grid>
          </GridContainer>}
        </Box>
      )}
    </>
  );
};

export default LimitForm;
