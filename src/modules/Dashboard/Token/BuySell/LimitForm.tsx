import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {useWeb3} from 'hooks/useWeb3';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import {Alert, Skeleton} from '@material-ui/lab';
import VerticalSwap from './VerticalSwap';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {OrderSide, Token} from 'types/app';
import SelectTokenV2 from './SelectTokenV2';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoinFromNetworkName} from 'utils';
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
import {FEE_RECIPIENT} from 'shared/constants/Blockchain';
import {ReactComponent as TradeIcon} from '../../../../assets/images/icons/trade.svg';
import SelectTokenDialog from './Modal/SelectTokenDialog';
import {limitFormStyles as useStyles} from './index.styles';

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

  const classes = useStyles();

  const {web3State, onConnectWeb3} = useWeb3();

  const network = useNetwork();
  const [isInverted, setIsInverted] = useState(false);

  const [
    tokenFromBalance,
    setTokenFromBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [
    tokenToBalance,
    setTokenToBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [expiryInput, setExpiryInput] = useState<number>(1);
  const [expirySelect, setExpirySelect] = useState<number>(86400);
  const [allowanceTarget, setAllowanceTarget] = useState<string>();
  const [showSelectTokenDialog, setShowSelectTokenDialog] = useState<boolean>(false);
  const [selectTo, setSelectTo] = useState<'from' | 'to'>('from');
  const notConnected = useMemo(() => web3State !== Web3State.Done, [web3State]);

  if (notConnected && tokenFrom === undefined) {
    const tokenETH = select1.find(
      (e) =>
      e.symbol.toLowerCase() ===
        GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(networkName) &&
        e.symbol.toLowerCase() !== tokenTo?.symbol.toLowerCase(),
    );

    onChangeToken(tokenETH, 'from');
  }

  const switchTokens = () => {
    if (tokenFrom) {
      onChangeToken(tokenFrom, 'to');
    }

    if (tokenTo) {
      onChangeToken(tokenTo, 'from');
    }

    setPrice((amountTo || 0) / (amountFrom || 1));
  }

  useEffect(() => {
    if (tokenFrom && tokenTo && chainId && account) {
      const getTokenBalance = (token: (Token | undefined)) =>
        balances.find((e) => {
          const symbol = token && isNativeCoinFromNetworkName(token?.symbol, networkName)
            ? token?.address.toLowerCase()
            : token?.symbol.toLowerCase();

          return e.currency?.symbol?.toLowerCase() === symbol;
        });

      setTokenFromBalance(getTokenBalance(tokenFrom));

      setTokenToBalance(getTokenBalance(tokenTo));

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
          feeRecipient: FEE_RECIPIENT,
          affiliateAddress: FEE_RECIPIENT,
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
    const newPrice = isInverted ? 1 / event.target.value : event.target.value;
    setPrice(newPrice);
    setAmountTo((amountFrom || 0) * newPrice);
  };

  const handleExpiryInputChange = (event: any) => {
    setExpiryInput(event.target.value);
  };

  const handleExpirySelectChange = (event: any) => {
    setExpirySelect(event.target.value);
  };

  let errorMessage: (string | undefined);
  const disabled = false;


  const connectButton = (
    <Box m={6} display='flex' alignItems='center' justifyContent='center'>
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
  } else if (!tokenFromBalance || !tokenFromBalance.value || tokenFromBalance.value === 0) {
    errorMessage = 'No available balance for chosen token';
  } else if (amountFrom && tokenFromBalance.value < amountFrom) {
    errorMessage = 'Insufficient balance for chosen token';
  } else if (networkName !== network) {
    errorMessage = `Switch to ${FORMAT_NETWORK_NAME(network)} in your wallet`;
  } else if (networkName !== EthereumNetwork.ethereum) {
    errorMessage = `Limit orders are not support on ${FORMAT_NETWORK_NAME(
      network,
    )} yet `;
  }

  const isNative =
    isNativeCoinFromNetworkName(tokenFrom?.symbol ?? '', networkName) ||
    isNativeCoinFromNetworkName(tokenTo?.symbol ?? '', networkName);

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

  const handleSelectTokenTo = useCallback(() => {
    setSelectTo('to');
    setShowSelectTokenDialog(true);
  }, [onChangeToken]);

  const handleSelectTokenFrom = useCallback(() => {
    setSelectTo('from');
    setShowSelectTokenDialog(true);
  }, [onChangeToken]);

  const handleSelectToken = useCallback(
    (token: Token) => {
      setShowSelectTokenDialog(false);
      onChangeToken(token, selectTo);
    },
    [selectTo, onChangeToken],
  );

  const getTokens = useCallback(
    (target: string) => {
      return target === 'from' && web3State === Web3State.Done && select0.length > 0
        ? select0
        : select1;

      return select1;
    },
    [web3State, select0, select1],
  );

  const handleSelectTokenDialogClose = useCallback(() => {
    setShowSelectTokenDialog(false);
  }, []);

  return (
    <Box className={classes.limitContainer}>
      <SelectTokenDialog
        open={showSelectTokenDialog}
        tokens={getTokens(selectTo)}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
      />
      {networkName !== EthereumNetwork.ethereum && (
        <Box>
          <Box className={classes.boxContainer}>
            <GridContainer>
              <Grid item xs={12}>
                <Alert severity="info">
                  Limit orders are only supported on{' '}
                  {FORMAT_NETWORK_NAME(EthereumNetwork.ethereum)} Network for
                  now
                </Alert>
              </Grid>
            </GridContainer>
          </Box>
        </Box>
      )}

      {networkName == EthereumNetwork.ethereum && (
        <Box py={4}>
          <form noValidate autoComplete='off'>
            <Box className={classes.boxContainer}>
              <GridContainer>
                {isNative && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      To use {nativeCoinSymbol} on Limit orders you need to wrap
                      your {nativeCoinSymbol} to {wNativeCoinSymbol}, and use{' '}
                      {wNativeCoinSymbol} to place limit orders
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={5}>
                  <Typography variant="body2" className={classes.inputLabel}>
                    <IntlMessages id='app.youSend' />
                  </Typography>
                  <Box height={48}>
                    <SelectTokenV2
                      id={'marketSel1'}
                      label={' '}
                      selected={tokenFrom}
                      disabled={disabled}
                      onClick={handleSelectTokenFrom}
                    />
                  </Box>
                </Grid>
                <Grid item sm={7}>
                  <Typography variant="body2" className={classes.balance}>
                    {account ? (
                      `Balance ${tokenFromBalance?.value?.toFixed(4) || 0} ${tokenFromBalance?.currency?.symbol || ''}`
                    ) : (
                    <Skeleton width={'100%'} />
                  )}
                  </Typography>
                  <TextField
                    variant='outlined'
                    type='number'
                    fullWidth
                    value={amountFrom}
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
                {!isNative && (
                  <>
                    <VerticalSwap switchTokens={switchTokens} />
                    <Grid
                      item
                      xs={12}
                      md={5}>
                      <Typography variant="body2" className={classes.inputLabel}>
                        <IntlMessages id='app.youReceive' />
                      </Typography>
                      <Box height={48}>
                        <SelectTokenV2
                          id={'marketSel0'}
                          label={' '}
                          selected={tokenTo}
                          disabled={disabled}
                          onClick={handleSelectTokenTo}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={7}>
                      <Typography variant="body2" className={classes.balance}>
                        {account ? (
                          `Balance ${tokenToBalance?.value?.toFixed(4) || 0} ${tokenToBalance?.currency?.symbol || ''}`
                        ) : (
                          <Skeleton width={'100%'} />
                        )}
                      </Typography>
                      <TextField
                        variant='outlined'
                        fullWidth
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

                    <Grid item xs={12}>
                      <Grid
                        item
                        xs={12}>
                        <Typography variant="body2" className={classes.inputLabel}>
                          <IntlMessages id='app.price' />
                        </Typography>
                        <TextField
                          variant='outlined'
                          fullWidth
                          value={isInverted ? 1 / price : price}
                          onChange={handlePriceChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position='end'
                                style={{fontSize: '13px'}}
                                onClick={() => setIsInverted(!isInverted)}>
                                {tokenFrom && tokenTo && (
                                  <>
                                    {isInverted
                                      ? `${tokenFrom.symbol.toUpperCase()} per ${tokenTo.symbol.toUpperCase()}`
                                      : `${tokenTo.symbol.toUpperCase()} per ${tokenFrom.symbol.toUpperCase()}`}
                                  </>
                                )}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} className={classes.expiryContainer}>
                      <Grid
                        item
                        xs={5}>
                        <Typography variant="body2" className={classes.inputLabel}>
                          <IntlMessages id='app.expiry' />
                        </Typography>
                        <Box
                          display='flex'
                          justifyContent='center'>
                          <Select
                            className={classes.select}
                            variant="outlined"
                            value={expirySelect}
                            onChange={handleExpirySelectChange}>
                            <MenuItem value={86400} selected={true}>Days</MenuItem>
                            <MenuItem value={60}>Minutes</MenuItem>
                            <MenuItem value={1}>Seconds</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                      <Grid
                        style={{ marginTop: '24px' }}
                        item
                        xs={7}>
                        <TextField
                          variant='outlined'
                          type="number"
                          fullWidth
                          value={expiryInput}
                          onChange={handleExpiryInputChange}
                        />
                      </Grid>

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

          {!notConnected && (
            <GridContainer>
              <Grid item xs={12} sm={12} className={classes.submit}>
                <Button
                  className={classes.btnPrimary}
                  fullWidth
                  size='large'
                  variant='contained'
                  color='primary'
                  onClick={handleTrade}
                  disabled={
                    (tokenFromBalance?.value || 0) < (amountFrom || 0) ||
                    !!errorMessage ||
                    amountTo === 0 ||
                    web3State !== Web3State.Done
                  }>
                    {isNative && (
                      <Box fontSize='large' fontWeight='bold'>
                        Convert {nativeCoinSymbol} -{`>`} {wNativeCoinSymbol}
                      </Box>
                    )}
                    {!isNative && errorMessage && account ? (
                      errorMessage
                    ) : (
                      <>
                        <Box mx={2} display={'flex'}>
                          <TradeIcon />
                        </Box>
                        <Box fontSize='large' fontWeight='bold'>
                          Trade
                        </Box>
                      </>
                    )}
                </Button>
              </Grid>
            </GridContainer>
          )}
          {notConnected && (
            <Grid style={{ padding: '8px' }} item xs={12} sm={12}>
              {connectButton}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LimitForm;
