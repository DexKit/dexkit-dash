import React, {useCallback, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';

import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {Paper, useTheme} from '@material-ui/core';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import InputAdornment from '@material-ui/core/InputAdornment';
import {OrderSide, Token} from 'types/app';
import SelectTokenV2 from './SelectTokenV2';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoin, isNativeCoinFromNetworkName} from 'utils';
import {MyBalances, Web3State} from 'types/blockchain';
import {FEE_PERCENTAGE, FEE_RECIPIENT} from 'shared/constants/Blockchain';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {isMobile} from 'web3modal';
import {
  FORMAT_NETWORK_NAME,
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {useNetwork} from 'hooks/useNetwork';
import {Skeleton} from '@material-ui/lab';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {ReactComponent as TradeIcon} from '../../../../assets/images/icons/trade.svg';

import {marketFormStyles as useStyles} from './index.styles';
import SelectTokenBalanceDialog from './Modal/SelectTokenBalanceDialog';
import {useHistory} from 'react-router-dom';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import {FEATURE_TRADE_COINS_ZRX} from 'utils/features';

interface Props {
  chainId: number | undefined;
  account: string | undefined;
  networkName: EthereumNetwork;
  balances: GetMyBalance_ethereum_address_balances[];
  select0: Token[];
  select1: Token[];
  tokenFrom: Token | undefined;
  tokenTo: Token | undefined;
  disableReceive?: boolean;
  onChangeToken: (token: Token | undefined, type: 'from' | 'to') => void;
  onSwitchTokensCallback?: (from?: Token, to?: Token) => void;
  onChangeDisableReceiveCallback?: (type: 'from' | 'to') => void;
  onTrade: (data: ModalOrderData) => void;
}

const MarketForm: React.FC<Props> = (props) => {
  const {
    chainId,
    account,
    networkName,
    balances,
    select0,
    select1,
    tokenFrom,
    tokenTo,
    disableReceive,
    onChangeToken,
    onTrade,
    onSwitchTokensCallback,
    onChangeDisableReceiveCallback,
  } = props;

  const theme = useTheme();

  const classes = useStyles();
  const {messages, formatMessage} = useIntl();

  const network = useNetwork();
  const history = useHistory();
  const {web3State} = useWeb3();
  const [disableSelect, setDisableSelect] = useState(
    disableReceive ? 'to' : '',
  );

  const [tokenBalance, setTokenBalance] =
    useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [allowanceTarget, setAllowanceTarget] = useState<string>();

  useEffect(() => {
    if (web3State !== Web3State.Done && tokenFrom === undefined) {
      const tokenETH = select1.find(
        (e) =>
          (e.symbol.toLowerCase() ===
            GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName) &&
            e.networkName === networkName) ||
          (e.symbol.toLowerCase() ===
            GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(networkName) &&
            e.symbol.toLowerCase() !== tokenTo?.symbol.toLowerCase() &&
            e.networkName === networkName),
      );
      onChangeToken(tokenETH, 'from');
    }
  }, [tokenFrom, web3State, networkName, select1, onChangeToken, tokenTo]);

  /* eslint-disable */
  const switchTokens = useCallback(() => {
    if (onSwitchTokensCallback) {
      onSwitchTokensCallback(tokenTo, tokenFrom);
    } else {
      if (tokenTo) {
        onChangeToken(tokenTo, 'from');
      }

      if (tokenFrom) {
        onChangeToken(tokenFrom, 'to');
      }
    }

    if (disableSelect) {
      if (disableSelect === 'to') {
        setDisableSelect('from');
        if (onChangeDisableReceiveCallback) {
          onChangeDisableReceiveCallback('from');
        }
      } else {
        setDisableSelect('to');
        if (onChangeDisableReceiveCallback) {
          onChangeDisableReceiveCallback('to');
        }
      }
    }
  }, [
    tokenFrom,
    tokenTo,
    onChangeToken,
    onSwitchTokensCallback,
    onChangeDisableReceiveCallback,
  ]);

  const {priceQuote: priceQuoteTo} = useTokenPriceUSD(
    tokenTo?.address || tokenTo?.symbol,
    networkName,
    OrderSide.Buy,
    amountTo,
    tokenTo?.decimals,
    undefined,
    chainId,
  );

  // const {priceQuote: priceQuoteToUnit} = useTokenPriceUSD(
  //   tokenTo?.address || tokenTo?.symbol,
  //   networkName,
  //   OrderSide.Buy,
  //   1,
  //   tokenTo?.decimals,
  //   undefined,
  //   chainId,
  // );

  const {priceQuote: priceQuoteFrom} = useTokenPriceUSD(
    tokenFrom?.address || tokenFrom?.symbol,
    networkName,
    OrderSide.Sell,
    amountFrom,
    tokenFrom?.decimals,
    undefined,
    chainId,
  );

  const onFetch = useCallback(
    (newValue: number | undefined, side: 'to' | 'from') => {
      if (side === 'from') {
        setAmountFrom(newValue);
      } else {
        if (newValue) {
          setAmountTo(newValue);
        }
      }

      if (tokenFrom && tokenTo && chainId && newValue) {
        fetchQuote(
          {
            chainId: chainId,
            baseToken: side === 'from' ? tokenFrom : tokenTo,
            quoteToken: side === 'from' ? tokenTo : tokenFrom,
            orderSide: OrderSide.Sell,
            makerAmount: fromTokenUnitAmount(newValue, tokenFrom.decimals),
            // Parameters used to prevalidate quote at final
            allowedSlippage: 0.03,
            ethAccount: account,
            buyTokenPercentage: FEE_PERCENTAGE,
            feeRecipient: FEE_RECIPIENT,
            affiliateAddress: FEE_RECIPIENT,
            intentOnFill: false,
          },
          networkName,
        )
          .then((e) => {
            if (side === 'from') {
              setAmountTo(
                toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber(),
              );
            } else {
              setAmountFrom(
                toTokenUnitAmount(e.buyAmount, tokenFrom.decimals).toNumber(),
              );
            }
            setAllowanceTarget(e.allowanceTarget);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    [networkName, tokenFrom, tokenTo, chainId, account],
  );

  const setMax = useCallback(() => {
    if (tokenBalance && tokenBalance.value) {
      // If is native coin we not allow user to max all of it, and leave some for gas
      if (isNativeCoin(tokenBalance.currency?.symbol ?? '', chainId ?? 1)) {
        if (tokenBalance?.value > 0.03) {
          setAmountFrom(tokenBalance?.value - 0.03);
          onFetch(tokenBalance?.value - 0.03, 'from');
        }
      } else {
        // Problem: balance comes with 8 decimals (rounded up) from the api
        setAmountFrom(tokenBalance?.value - 0.000000001 ?? 0);
        onFetch(tokenBalance?.value - 0.000000001 ?? 0, 'from');
      }
    }
  }, [tokenBalance, chainId, onFetch]);

  useEffect(() => {
    setTokenBalance(
      balances.find((e) => {
        if (
          tokenFrom?.symbol &&
          isNativeCoinFromNetworkName(tokenFrom?.symbol, networkName) &&
          tokenFrom?.networkName === networkName
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
  }, [tokenFrom, balances, web3State, networkName]);

  const onChangeFrom = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      let value = undefined;

      if (e.target.value) {
        value = Number(e.target.value);

        if (value < 0) {
          value = 0;
        }
      }
      onFetch(value, 'from');
    },
    [onFetch],
  );

  const onChangeTo = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      let value = undefined;

      if (e.target.value) {
        value = Number(e.target.value);

        if (value < 0) {
          value = 0;
        }
      }
      onFetch(value, 'to');
    },
    [onFetch],
  );

  const handleTrade = useCallback(() => {
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
  }, [amountFrom, tokenFrom, tokenTo, account, allowanceTarget, amountTo]);

  let errorMessage = null;
  const notConnected = web3State !== Web3State.Done;
  const handleConnectWallet = useCallback(() => {
    history.push(LOGIN_WALLET_ROUTE);
  }, []);
  const connectButton = (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <Button
        fullWidth
        size='large'
        variant='contained'
        color='primary'
        startIcon={
          web3State === Web3State.Connecting ? (
            <CircularProgress size={theme.spacing(6)} color='inherit' />
          ) : undefined
        }
        onClick={handleConnectWallet}
        endIcon={<AccountBalanceWalletIcon />}
        disabled={web3State === Web3State.Connecting}>
        {web3State === Web3State.Connecting ? (
          isMobile() ? (
            <IntlMessages id='app.dashboard.connecting' />
          ) : (
            <>
              <IntlMessages id='app.dashboard.connecting' />{' '}
              <IntlMessages id='app.dashboard.checkWallet' />
            </>
          )
        ) : isMobile() ? (
          <IntlMessages id='app.dashboard.connect' />
        ) : (
          <IntlMessages id='app.dashboard.connectWallet' />
        )}
      </Button>
    </Box>
  );
  // disabled = true;
  if (select0.length === 0) {
    errorMessage = messages['app.dashboard.noBalanceWallet'];
  } else if (!tokenBalance || !tokenBalance.value || tokenBalance.value === 0) {
    errorMessage = messages['app.dashboard.noBalanceChosenToken'];
  } else if (amountFrom && tokenBalance.value < amountFrom) {
    errorMessage = messages['app.dashboard.insufficientBalanceChosenToken'];
  } else if (networkName !== network) {
    errorMessage = `${messages['app.dashboard.switchTo']} ${FORMAT_NETWORK_NAME(
      networkName,
    )} ${messages['app.dashboard.networkInYourWallet']}`;
  } else if (!FEATURE_TRADE_COINS_ZRX(chainId)) {
    errorMessage = formatMessage({
      id: 'common.networkNotSupported',
      defaultMessage: 'Network not supported',
    });
  }
  const {usdFormatter} = useUSDFormatter();

  const [selectTo, setSelectTo] = useState<'from' | 'to'>('from');
  const [showSelectTokenDialog, setShowSelectTokenDialog] = useState(false);

  const handleSelectTokenTo = useCallback(() => {
    setSelectTo('to');
    setShowSelectTokenDialog(true);
  }, [setSelectTo, setShowSelectTokenDialog]);

  const handleSelectTokenFrom = useCallback(() => {
    setSelectTo('from');
    setShowSelectTokenDialog(true);
  }, [setSelectTo, setShowSelectTokenDialog]);

  const handleSelectToken = useCallback(
    (token: Token) => {
      setShowSelectTokenDialog(false);
      onChangeToken(token, selectTo);
    },
    [selectTo, onChangeToken],
  );

  const handleSelectTokenDialogClose = useCallback(() => {
    setShowSelectTokenDialog(false);
  }, []);

  return (
    <Box>
      <SelectTokenBalanceDialog
        title={
          selectTo === 'from'
            ? (messages['app.dashboard.youSend'] as string)
            : (messages['app.dashboard.youReceive'] as string)
        }
        balances={balances as MyBalances[]}
        open={showSelectTokenDialog}
        tokens={select1}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
        enableFilters
      />
      <Box py={2}>
        <form noValidate autoComplete='off'>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='space-between'>
                  <Typography variant='body2'>
                    <IntlMessages id='app.dashboard.youSend' />
                  </Typography>

                  <Typography
                    onClick={setMax}
                    variant='body2'
                    className={classes.maxBalance}
                    color='textSecondary'>
                    {account ? (
                      `${tokenBalance?.value?.toFixed(4) || 0} ${
                        tokenBalance?.currency?.symbol || ''
                      }`
                    ) : (
                      <Skeleton width={'100%'} />
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={5} sm={5}>
                <SelectTokenV2
                  id={'marketSel0'}
                  label={messages['app.dashboard.yourCoins'] as string}
                  selected={tokenFrom}
                  disabled={disableSelect === 'from'}
                  onClick={handleSelectTokenFrom}
                />
              </Grid>
              <Grid item xs={7} sm={7}>
                <TextField
                  variant='outlined'
                  type='number'
                  value={amountFrom}
                  fullWidth
                  onChange={(e) => onChangeFrom(e)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end' style={{fontSize: '13px'}}>
                        {priceQuoteFrom ? (
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
                        ) : (
                          ''
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
                <Typography variant='body1'>
                  <IntlMessages id='app.dashboard.youReceive' />
                </Typography>
              </Grid>
              <Grid item xs={5} md={5}>
                {select1.length > 0 && (
                  <SelectTokenV2
                    id={'marketSel1'}
                    selected={tokenTo}
                    disabled={disableSelect === 'to'}
                    onClick={handleSelectTokenTo}
                  />
                )}
              </Grid>
              <Grid item xs={7} md={7}>
                <TextField
                  variant='outlined'
                  className={classes.toText}
                  fullWidth
                  onChange={(e) => onChangeTo(e)}
                  value={amountTo}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end' style={{fontSize: '13px'}}>
                        {priceQuoteTo && (
                          <>
                            ≈
                            <i>
                              {' '}
                              {usdFormatter.format(
                                Number(priceQuoteTo?.price) * Number(amountTo),
                              )}
                            </i>
                          </>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {(priceQuoteTo || priceQuoteFrom) && (
                <Grid item xs={12}>
                  <Box>
                    <Accordion component={Paper} variant='outlined'>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'>
                        <Typography style={{textDecoration: 'none'}}>
                          <IntlMessages id='app.dashboard.additionalInformation' />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          display='flex'
                          width='100%'
                          justifyContent='space-evenly'>
                          {priceQuoteTo && (
                            <Box pr={2}>
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
                            <Box pr={2}>
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
                          {/*priceQuoteTo?.price && priceQuoteToUnit?.price && (
                            <Box>
                              <p>
                                Price Impact:{' '}
                                {(
                                  ((Number(priceQuoteTo.price) -
                                    Number(priceQuoteToUnit.price)) /
                                    Number(priceQuoteTo.price)) *
                                  100
                                ).toFixed(2)}
                                %
                              </p>
                            </Box>
                                )*/}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                {!notConnected && (
                  <Button
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
                        <TradeIcon />
                        <Box ml={1} fontSize='large' fontWeight='bold'>
                          <IntlMessages id='app.dashboard.trade' />
                        </Box>
                      </>
                    )}
                  </Button>
                )}
                {notConnected && connectButton}
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default MarketForm;
