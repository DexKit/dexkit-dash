import React, {useEffect, useState, useCallback, useContext} from 'react';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {useWeb3} from 'hooks/useWeb3';
import {AppContext} from '@crema';

import GridContainer from '@crema/core/GridContainer';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  makeStyles,
  Grid,
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import InputAdornment from '@material-ui/core/InputAdornment';
import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';
import {OrderSide, Token} from 'types/app';
import SelectTokenV2 from './SelectTokenV2';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {fetchQuote} from 'services/rest/0x-api';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {isNativeCoin, isNativeCoinFromNetworkName} from 'utils';
import {Web3State} from 'types/blockchain';
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
import {FEE_RECIPIENT} from 'shared/constants/Blockchain';
import SelectTokenDialog from './Modal/SelectTokenDialog';
import {Skeleton} from '@material-ui/lab';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {ReactComponent as BitcoinConvert} from '../../../../assets/images/icons/bitcoin-convert.svg';

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

const useStyles = makeStyles((theme: CremaTheme) => ({
  marketContainer: {
    '& .MuiOutlinedInput-input': {
      padding: '14px'
    }
  },
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
  toText: {
    '&:disabled': {
      color: 'text.primary',
    },
  },
  inputLabel: {
    paddingBottom: '0px !important',
    fontWeight: 'bold'
  },
  swap: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  submit: {
    marginTop: '20px'
  }
}));

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
    onChangeToken,
    onTrade,
  } = props;

  const {theme} = useContext<AppContextPropsType>(AppContext);

  const classes = useStyles();

  const network = useNetwork();

  const {web3State, onConnectWeb3} = useWeb3();

  const [
    tokenBalance,
    setTokenBalance,
  ] = useState<GetMyBalance_ethereum_address_balances>();

  const [amountFrom, setAmountFrom] = useState<number | undefined>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
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

  const setMax = () => {
    if (tokenBalance && tokenBalance.value) {
      // If is native coin we not allow user to max all of it, and leave some for gas
      if (isNativeCoin(tokenBalance.currency?.symbol ?? '', chainId ?? 1)) {
        if (tokenBalance?.value > 0.03) {
          setAmountFrom(tokenBalance?.value - 0.03);
          onFetch(tokenBalance?.value - 0.03);
        }
      } else {
        // Problem: balance comes with 8 decimals (rounded up) from the api
        setAmountFrom(tokenBalance?.value - 0.000000001 ?? 0);
        onFetch(tokenBalance?.value - 0.000000001 ?? 0);
      }
    }
  };

  useEffect(() => {
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
          feeRecipient: FEE_RECIPIENT,
          affiliateAddress: FEE_RECIPIENT,
          intentOnFill: false,
        },
        networkName,
      )
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
  const disabled = false;
  const notConnected = web3State !== Web3State.Done;

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
  // disabled = true;
  if (select0.length === 0) {
    errorMessage = 'No balances found in your wallet';
  } else if (!tokenBalance || !tokenBalance.value || tokenBalance.value === 0) {
    errorMessage = 'No available balance for chosen token';
  } else if (amountFrom && tokenBalance.value < amountFrom) {
    errorMessage = 'Insufficient balance for chosen token';
  } else if (networkName !== network) {
    errorMessage = `Switch to ${FORMAT_NETWORK_NAME(
      networkName,
    )} Network in your wallet`;
  }
  const {usdFormatter} = useUSDFormatter();

  const [selectTo, setSelectTo] = useState('');
  const [showSelectTokenDialog, setShowSelectTokenDialog] = useState(false);

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
      if (selectTo == 'to') {
        onChangeToken(token, 'to');
      } else if (selectTo === 'from') {
        onChangeToken(token, 'from');
      }
    },
    [selectTo, onChangeToken],
  );

  const getTokens = useCallback(
    (target: string) => {
      if (target === 'to') {
        return select1;
      } else if (target === 'from') {
        return web3State === Web3State.Done && select0.length > 0
          ? select0
          : select1;
      }

      return [];
    },
    [web3State, select0, select1],
  );

  const handleSelectTokenDialogClose = useCallback(() => {
    setSelectTo('');
    setShowSelectTokenDialog(false);
  }, []);

  return (
    <Box className={classes.marketContainer}>
      <SelectTokenDialog
        open={showSelectTokenDialog}
        tokens={getTokens(selectTo)}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
      />
      <Box py={2}>
        <form noValidate autoComplete='off'>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={6} className={classes.inputLabel}>
                <IntlMessages id='app.youSend' />
              </Grid>
              <Grid item xs={6} className={classes.inputLabel}>
                <Typography
                  onClick={setMax}
                  variant='body2'
                  color='textSecondary'
                  align='right'>
                  {account ? (
                    `${tokenBalance?.value?.toFixed(4) || 0} ${tokenBalance?.currency?.symbol || ''}`
                  ) : (
                    <Skeleton width={'100%'} />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={5} sm={5}>
                <SelectTokenV2
                  id={'marketSel0'}
                  label={'Your Coins'}
                  selected={tokenFrom}
                  disabled={disabled}
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
                style={{ padding: '1em', marginTop: 4}}
                item
                xs={12}
                md={7}>
                <Box
                  mb={2}
                  color='grey.400'
                  textAlign='center'
                  onClick={() => switchTokens()}
                  className={`${classes.textRes} ${classes.swap}`}>
                  <SwapVertIcon fontSize="large"/>
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.inputLabel}>
                <IntlMessages id='app.youReceive' />
              </Grid>
              <Grid item xs={5} md={5}>
                {select1.length > 0 && (
                  <SelectTokenV2
                    id={'marketSel1'}
                    selected={tokenTo}
                    disabled={disabled}
                    onClick={handleSelectTokenTo}
                  />
                )}
              </Grid>
              <Grid item xs={7} md={7}>
                <TextField
                  variant='outlined'
                  className={classes.toText}
                  fullWidth
                  value={amountTo}
                  InputProps={{
                    readOnly: true,
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
              <Grid xs={12} md={12}>
                <Box padding={'8px'}>
                  {
                    (priceQuoteTo || priceQuoteFrom) && (
                      <Accordion style={{ backgroundColor: theme.palette.sidebar.bgColor }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography style={{ textDecoration: 'none' }}>Aditional information</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box display={'flex'} width="100%" justifyContent={'space-evenly'}>
                            {priceQuoteTo && (
                              <Box>
                                <p>
                                  1 {tokenTo?.symbol.toUpperCase()}{' '}
                                  {priceQuoteTo && (
                                    <>
                                      ≈
                                      <i>
                                        {' '}
                                        {usdFormatter.format(Number(priceQuoteTo?.price))}
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
                        </AccordionDetails>
                      </Accordion>
                    )
                  }
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.submit}>
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
                        <BitcoinConvert />
                        <Box ml={1} fontSize='large' fontWeight='bold'>
                          Trade
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
