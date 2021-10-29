import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {useWeb3} from 'hooks/useWeb3';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {useTheme} from '@material-ui/core';
import {Alert, Skeleton} from '@material-ui/lab';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import SwapVertIcon from '@material-ui/icons/SwapVert';

import {OrderSide, Token} from 'types/app';
import SelectTokenV2 from './SelectTokenV2';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoinFromNetworkName} from 'utils';
import {MyBalances, Web3State} from 'types/blockchain';
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
import {FEE_PERCENTAGE, FEE_RECIPIENT} from 'shared/constants/Blockchain';
import {ReactComponent as TradeIcon} from '../../../../assets/images/icons/trade.svg';
import {limitFormStyles as useStyles} from './index.styles';
import SelectTokenBalanceDialog from './Modal/SelectTokenBalanceDialog';
import {useHistory} from 'react-router-dom';

interface Props {
  chainId: number | undefined;
  account: string | undefined;
  networkName: EthereumNetwork;

  balances: GetMyBalance_ethereum_address_balances[];
  select0: Token[];
  select1: Token[];
  tokenFrom: Token | undefined;
  tokenTo: Token | undefined;
  onChangeToken: (token: Token | undefined, type: 'from' | 'to') => void;
  onTrade: (data: ModalOrderData) => void;
  disableReceive?: boolean;
}

const LimitForm: React.FC<Props> = (props) => {
  const {
    chainId,
    account,
    networkName,
    balances,
    select0,
    select1,
    tokenFrom,
    tokenTo,
    onChangeToken,
    onTrade,
    disableReceive,
  } = props;

  const classes = useStyles();

  const {web3State} = useWeb3();
  const history = useHistory();
  const network = useNetwork();
  const {messages} = useIntl();
  const [isInverted, setIsInverted] = useState(false);

  const [tokenFromBalance, setTokenFromBalance] =
    useState<GetMyBalance_ethereum_address_balances>();

  const [tokenToBalance, setTokenToBalance] =
    useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [expiryInput, setExpiryInput] = useState<number>(1);
  const [expirySelect, setExpirySelect] = useState<number>(86400);
  const [allowanceTarget, setAllowanceTarget] = useState<string>();
  const [showSelectTokenDialog, setShowSelectTokenDialog] =
    useState<boolean>(false);
  const [selectTo, setSelectTo] = useState<'from' | 'to'>('from');
  const [disableSelect, setDisableSelect] = useState(
    disableReceive ? 'to' : '',
  );

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

    if (disableSelect) {
      if (disableSelect === 'to') {
        setDisableSelect('from');
      } else {
        setDisableSelect('to');
      }
    }
  };

  useEffect(() => {
    if (tokenFrom && tokenTo && chainId && account) {
      const getTokenBalance = (token: Token | undefined) =>
        balances.find((e) => {
          const symbol =
            token && isNativeCoinFromNetworkName(token?.symbol, networkName)
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
          buyTokenPercentage: FEE_PERCENTAGE,
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

  let errorMessage: string | undefined;

  const handleConnectWallet = useCallback(() => {
    history.push('/onboarding/login-wallet');
  }, []);

  const connectButton = (
    <Box m={6} display='flex' alignItems='center' justifyContent='center'>
      <Button
        size='large'
        variant='contained'
        color='primary'
        onClick={handleConnectWallet}
        endIcon={<AccountBalanceWalletIcon />}>
        {web3State === Web3State.Connecting
          ? isMobile()
            ? `${messages['app.connecting']}...`
            : `${messages['app.connecting']}... ${messages['app.checkWallet']}`
          : isMobile()
          ? `${messages['app.connect']}`
          : `${messages['app.connect']} ${messages['app.wallet']}`}
      </Button>
    </Box>
  );

  if (select0.length === 0) {
    errorMessage = messages['app.noBalanceWallet'] as string;
  } else if (
    !tokenFromBalance ||
    !tokenFromBalance.value ||
    tokenFromBalance.value === 0
  ) {
    errorMessage = messages['app.noBalanceChosenToken'] as string;
  } else if (amountFrom && tokenFromBalance.value < amountFrom) {
    errorMessage = messages['app.insufficientBalanceChoseToken'] as string;
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

  const nativeCoinSymbol =
    GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase();
  const wNativeCoinSymbol =
    GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase();

  const {priceQuote: priceQuoteTo} = useTokenPriceUSD(
    tokenTo?.address || tokenTo?.symbol,
    networkName,
    OrderSide.Buy,
    amountTo,
    tokenTo?.decimals,
  );
  const {priceQuote: priceQuoteFrom} = useTokenPriceUSD(
    tokenFrom?.address || tokenFrom?.symbol,
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
      return target === 'from' &&
        web3State === Web3State.Done &&
        select0.length > 0
        ? select0
        : select1;
    },
    [web3State, select0, select1],
  );

  const handleSelectTokenDialogClose = useCallback(() => {
    setShowSelectTokenDialog(false);
  }, []);

  const theme = useTheme();

  return (
    <Box>
      <SelectTokenBalanceDialog
        title={
          selectTo === 'from'
            ? (messages['app.youSend'] as string)
            : (messages['app.youReceive'] as string)
        }
        balances={balances as MyBalances[]}
        open={showSelectTokenDialog}
        tokens={getTokens(selectTo)}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
        enableFilters
      />
      {networkName !== EthereumNetwork.ethereum && (
        <Box>
          <Box className={classes.boxContainer}>
            <GridContainer>
              <Grid item xs={12}>
                <Alert severity='info'>
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
            <Box>
              <Grid
                container
                spacing={4}
                alignItems='center'
                alignContent='center'>
                {isNative && (
                  <Grid item xs={12}>
                    <Alert severity='info'>
                      To use {nativeCoinSymbol} on Limit orders you need to wrap
                      your {nativeCoinSymbol} to {wNativeCoinSymbol}, and use{' '}
                      {wNativeCoinSymbol} to place limit orders
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    justifyContent='space-between'>
                    <Typography variant='body2'>
                      <strong>
                        <IntlMessages id='app.youSend' />
                      </strong>
                    </Typography>

                    <Typography variant='body2' color='textSecondary'>
                      {account ? (
                        `${tokenFromBalance?.value?.toFixed(4) || 0} ${
                          tokenFromBalance?.currency?.symbol || ''
                        }`
                      ) : (
                        <Skeleton width={theme.spacing(12)} />
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box height={56}>
                    <SelectTokenV2
                      id={'marketSel1'}
                      label={' '}
                      disabled={disableSelect === 'from'}
                      selected={tokenFrom}
                      onClick={handleSelectTokenFrom}
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    variant='outlined'
                    type='number'
                    fullWidth
                    value={amountFrom}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
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
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    justifyContent='center'>
                    <IconButton size='small' onClick={switchTokens}>
                      <SwapVertIcon color='primary' />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    justifyContent='space-between'>
                    <Typography variant='body2'>
                      <IntlMessages id='app.youReceive' />
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      className={classes.balance}>
                      {account ? (
                        `${tokenToBalance?.value?.toFixed(4) || 0} ${
                          tokenToBalance?.currency?.symbol || ''
                        }`
                      ) : (
                        <Skeleton width={theme.spacing(12)} />
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box height={56}>
                    <SelectTokenV2
                      id={'marketSel0'}
                      label={' '}
                      selected={tokenTo}
                      disabled={disableSelect === 'to'}
                      onClick={handleSelectTokenTo}
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    value={amountTo}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position='end'>
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
                  <Typography variant='body2'>
                    <IntlMessages id='app.price' />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                          className={classes.inputPriceAddornment}
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

                <Grid item xs={12}>
                  <Typography variant='body2'>
                    <IntlMessages id='app.expiry' />
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Select
                    className={classes.select}
                    variant='outlined'
                    value={expirySelect}
                    onChange={handleExpirySelectChange}>
                    <MenuItem value={86400} selected={true}>
                      {messages['app.days']}
                    </MenuItem>
                    <MenuItem value={60}>{messages['app.minutes']}</MenuItem>
                    <MenuItem value={1}>{messages['app.seconds']}</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    variant='outlined'
                    type='number'
                    fullWidth
                    value={expiryInput}
                    onChange={handleExpiryInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display='flex' justifyContent='space-evenly'>
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
              </Grid>
            </Box>
          </form>

          {!notConnected && (
            <Grid container spacing={4}>
              <Grid item xs={12} className={classes.submit}>
                <Button
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
                      {messages['app.convert']} {nativeCoinSymbol}{' '}
                      {messages['app.to']} {wNativeCoinSymbol}
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
                        {messages['app.trade']}
                      </Box>
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          )}
          {notConnected && (
            <Grid style={{padding: '8px'}} item xs={12} sm={12}>
              {connectButton}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LimitForm;
