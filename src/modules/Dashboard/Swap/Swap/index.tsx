import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  useTheme,
  Badge,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {Changelly} from 'services/rest/changelly';
import {ChangellyCoin, ChangellyTransaction} from 'types/changelly';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import HistoryIcon from '@material-ui/icons/History';

import {Steps} from './Provider';
import {ReviewOrder} from './Components/ReviewOrder';
import {SelectCoinsDialog} from './Modal/SelectCoins';

import {CoinSelectButton} from './Components/CoinSelectButton';
import {ReceiveAddressStep} from './Components/ReceiveAddressStep';
import {SwapHistoricDialog} from './Components/SwapHistoricDialog';
import {useSwapTransactions} from '../hooks';
import {STATUS_CONFIRMING, STATUS_WAITING} from '../util';
import SendCoinDialog from 'shared/components/Dialogs/SendCoinDialog';

import SelectTokensDialog from 'shared/components/Dialogs/SelectTokenDialog';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useTokenList} from 'hooks/useTokenList';
import {useWeb3} from 'hooks/useWeb3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import Close from '@material-ui/icons/Close';
import {ArrowForward} from '@material-ui/icons';

interface SwapComponentProps {
  onClose?: () => void;
}

export const SwapComponent = (props: SwapComponentProps) => {
  const {onClose} = props;
  const theme = useTheme();

  const userAccountAddress = useDefaultAccount();

  const [loading, setLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [step] = useState(Steps.Exchange);
  const [acceptAML, setAcceptAML] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);
  const [coins, setCoins] = useState<ChangellyCoin[]>([]);
  const [fromCoin, setFromCoin] = useState<ChangellyCoin>();
  const [toCoin, setToCoin] = useState<ChangellyCoin>();

  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);

  const [fromAmountValue, setFromAmountValue] = useState('');
  const [toAmountValue, setToAmountValue] = useState('');

  const [minFromAmount, setMinFromAmount] = useState<number>(0);
  const [addressToSend, setAddressToSend] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<ChangellyTransaction | null>(
    null,
  );
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [goToReceiveAddress, setGoToReceiveAddress] = useState(false);

  const {transactions, saveTransaction} = useSwapTransactions();
  const [showTransactions, setShowTransactions] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    (async () => {
      setLoading(true);

      const currFull = await Changelly.getCurrenciesFull();
      const currencies = currFull.result.filter((c: any) => c.enabled);

      setCoins(currencies);

      const btc = currencies.find((c: any) => c.ticker.toLowerCase() === 'btc');
      const eth = currencies.find((c: any) => c.ticker.toLowerCase() === 'eth');

      if (!toCoin) {
        setToCoin(btc);
      }

      if (!fromCoin) {
        setFromCoin(eth);
      }

      if (!btc || !eth) {
        return;
      }
      setLoading(false);
    })();
  }, []);

  const fetchCoinsAmounts = useCallback(async () => {
    if (!fromCoin || !toCoin) {
      return;
    }

    setValidAddress(false);

    try {
      setFromLoading(true);

      const r = await Changelly.getMinAmount({
        from: fromCoin.ticker,
        to: toCoin.ticker,
      });

      setFromLoading(false);

      if (r.result) {
        const newAmount = Number(r.result);

        setMinFromAmount(newAmount);
        setFromAmount(newAmount);
        setFromAmountValue(r.result);

        setToLoading(true);

        const res = await Changelly.getExchangeAmount({
          from: fromCoin.ticker,
          to: toCoin.ticker,
          amount: newAmount.toString(),
        });

        if (res.result) {
          const am = Number(res.result);
          setToAmountValue(res.result);
          setToAmount(am);
        }

        setToLoading(false);
      } else {
        return;
      }
    } catch {
      setFromLoading(false);
      setToLoading(false);
    }
  }, [toCoin, fromCoin]);

  const onSwitchCoin = useCallback(() => {
    if (!fromCoin || !toCoin) {
      return;
    }

    setFromCoin(toCoin);
    setToCoin(fromCoin);
  }, [toCoin, fromCoin]);

  const calculateRatio = useCallback(
    (from: string, to: string, amount: string) => {
      return Changelly.getExchangeAmount({
        from,
        to,
        amount,
      });
    },
    [],
  );

  const calculateToRatio = useCallback(
    (value: string) => {
      if (!toCoin || !fromCoin) {
        return;
      }

      if (calculateRatio) {
        setFromLoading(true);
        calculateRatio(toCoin.ticker, fromCoin.ticker, value)
          ?.then((result) => {
            if (result) {
              setFromAmountValue(result.result);
              setFromAmount(Number(result.result));
            }
          })
          .finally(() => {
            setFromLoading(false);
          });
      }
    },
    [toCoin, fromCoin, toAmount, calculateRatio],
  );

  const calculateFromRatio = useCallback(
    (value: string) => {
      if (!toCoin || !fromCoin) {
        return;
      }

      if (calculateRatio) {
        setToLoading(true);
        calculateRatio(fromCoin.ticker, toCoin.ticker, value)
          ?.then((result) => {
            if (result) {
              setToAmountValue(result.result);
              setToAmount(Number(result.result));
            }
          })
          .finally(() => {
            setToLoading(false);
          });
      }
    },
    [toCoin, fromCoin, fromAmount, calculateRatio],
  );

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = Number(e.target.value);

      let isPostive =
        e.target.value !== '' && parseFloat(e.target.value) >= 0.0;

      if (!isPostive) {
        setFromAmountValue('');
      } else {
        setFromAmountValue(e.target.value);
      }

      if (e.target.value === '') {
        setFromAmount(0);
      } else if (!isPostive) {
        setFromAmount(0);
      } else {
        setFromAmount(amount);
      }

      calculateFromRatio(e.target.value);
    },
    [setFromAmount, calculateFromRatio],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = Number(e.target.value);

      let isPostive =
        e.target.value !== '' && parseFloat(e.target.value) >= 0.0;

      if (!isPostive) {
        setToAmountValue('');
      } else {
        setToAmountValue(e.target.value);
      }

      if (e.target.value == '') {
        setToAmount(0);
      } else if (parseInt(e.target.value) < 0) {
        setToAmount(0);
      } else {
        setToAmount(amount);
      }

      calculateToRatio(e.target.value);
    },
    [setToAmount, calculateToRatio],
  );

  const handleChangeAccept = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptAML(e.target.checked);
    },
    [],
  );

  const handlePaste = useCallback((value: string) => {
    setAddressToSend(value);
  }, []);

  const getPriceRatioText = useCallback(() => {
    const to = toCoin?.name?.toUpperCase();
    const from = fromCoin?.name.toUpperCase();

    const ratio = Number(fromAmount) / Number(toAmount);

    return `1 ${to} ≈ ${ratio.toFixed(8)} ${from}`;
  }, [toAmount, fromAmount, toCoin, fromCoin]);

  const disabledButton =
    step === Steps.SetWallet && (!validAddress || !acceptAML);

  const isFromAmountValid = useCallback(() => {
    return fromAmount >= minFromAmount;
  }, [fromAmount, minFromAmount]);

  const [transactionError, setTransactioError] = useState('');

  const handleCreateTransaction = useCallback(() => {
    setCreatingTransaction(true);
    setTransactioError('');

    if (fromCoin && toCoin) {
      Changelly.createTransaction({
        from: fromCoin.ticker,
        to: toCoin.ticker,
        amount: fromAmount.toString(),
        address: addressToSend,
      })
        .then((r) => {
          if (r.result) {
            setTransaction(r.result as ChangellyTransaction);
            saveTransaction(r.result as ChangellyTransaction);
            setGoToReceiveAddress(false);
          } else {
            setTransactioError('Transaction failed, try again later.');
          }
        })
        .finally(() => {
          setCreatingTransaction(false);
        });
    }
  }, [fromCoin, toCoin, addressToSend, fromAmount]);

  const handleCancelTransaction = useCallback(() => {
    setTransaction(null);
  }, []);

  const [showSelectCoin, setShowSelectCoin] = useState(false);
  const [selectTo, setSelectTo] = useState('');

  const handleToSelectToken = useCallback(() => {
    setShowSelectCoin(true);
    setSelectTo('to');
  }, []);

  const handleFromSelectToken = useCallback(() => {
    setShowSelectCoin(true);
    setSelectTo('from');
  }, []);

  const handleSelectCoin = useCallback(
    (coin: ChangellyCoin) => {
      if (selectTo == 'to') {
        if (coin === fromCoin) {
          setFromCoin(toCoin);
        }

        setToCoin(coin);
      } else {
        if (coin === toCoin) {
          setToCoin(fromCoin);
        }

        setFromCoin(coin);
      }

      setSelectTo('');
      setShowSelectCoin(false);
    },
    [selectTo, fromCoin, toCoin],
  );

  useEffect(() => {
    fetchCoinsAmounts();
  }, [fromCoin, toCoin]);

  const handleCancelSelectCoin = useCallback(() => {
    setShowSelectCoin(false);
    setSelectTo('');
  }, []);

  const handleReset = useCallback(() => {
    setTransaction(null);
    fetchCoinsAmounts().finally(() => {
      setAddressToSend('');
      setAcceptAML(false);
      setGoToReceiveAddress(false);
    });
  }, [fetchCoinsAmounts]);

  const handleAddressToSendChange = useCallback(
    (value: string) => {
      setAddressToSend(value);
    },
    [setAddressToSend],
  );

  const handleGoToReceiveAddress = useCallback(() => {
    setGoToReceiveAddress(true);
    setAcceptAML(false);
  }, []);

  const handleGoBack = useCallback(() => {
    setGoToReceiveAddress(false);
    setAddressToSend('');
    setAcceptAML(false);
  }, []);

  const handleOpenTransactions = useCallback(() => {
    setShowTransactions(true);
  }, []);

  const handleCloseTransactions = useCallback(() => {
    setShowTransactions(false);
  }, []);

  const handleSelectTransaction = useCallback((tx: ChangellyTransaction) => {
    setTransaction(tx);
    setShowTransactions(false);
  }, []);

  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);

  const [showTransfer, setShowTransfer] = useState(false);

  const handleTransfer = useCallback((amount: number, address: string) => {
    setShowTransfer(true);
    setTransferAmount(amount);
    setTransferAddress(address);
  }, []);

  const handleCloseTransfer = useCallback(() => {
    setShowTransfer(false);
    setTransferAmount(0);
    setTransferAddress('');
    setSendCoinsError(false);
    setSendCoinsSuccess(false);
    setSendCoinsLoading(false);
  }, []);

  const {getWeb3} = useWeb3();
  const [showSelectTokens, setShowSelectTokens] = useState(false);
  const [balance, setBalance] = useState(0);
  const tokens = useTokenList(EthereumNetwork.ethereum);

  useEffect(() => {
    const web3 = getWeb3();

    if (userAccountAddress) {
      web3?.eth.getBalance(userAccountAddress).then((result: string) => {
        setBalance(toTokenUnitAmount(result, 18).toNumber());
      });
    }
  }, [getWeb3, userAccountAddress]);

  const handleSelectToken = useCallback(() => {}, []);

  const [sendCoinsSuccess, setSendCoinsSuccess] = useState(false);
  const [sendCoinsError, setSendCoinsError] = useState(false);
  const [sendCoinsLoading, setSendCoinsLoading] = useState(false);

  const handleSendCoin = useCallback(
    (amount: number, address: string) => {
      const web3 = getWeb3();

      if (userAccountAddress) {
        setSendCoinsLoading(true);
        web3?.eth
          .sendTransaction({
            from: userAccountAddress,
            value: fromTokenUnitAmount(amount, 18).toString(),
            to: address,
          })
          .on('confirmation', (confNumber: number) => {
            setSendCoinsSuccess(true);
            setSendCoinsLoading(false);
          })
          .on('error', () => {
            setSendCoinsError(true);
            setSendCoinsLoading(false);
          });
      }
    },
    [userAccountAddress],
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      <SelectCoinsDialog
        coins={coins}
        open={showSelectCoin}
        onSelectCoin={handleSelectCoin}
        onClose={handleCancelSelectCoin}
        selectTo={selectTo}
      />
      <SelectTokensDialog
        tokens={tokens}
        onSelectToken={handleSelectToken}
        open={showSelectTokens}
      />
      <SwapHistoricDialog
        open={showTransactions}
        transactions={transactions}
        onClose={handleCloseTransactions}
        onSelectTransaction={handleSelectTransaction}
      />
      <SendCoinDialog
        toAmount={transferAmount}
        toAddress={transferAddress}
        balance={balance}
        toToken={
          tokens.filter((token: any) => token.symbol.toUpperCase() === 'ETH')[0]
        }
        open={showTransfer}
        onSend={handleSendCoin}
        onClose={handleCloseTransfer}
        error={sendCoinsError}
        success={sendCoinsSuccess}
        loading={sendCoinsLoading}
      />
      <Card>
        {loading ? (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Skeleton height={theme.spacing(4)} width='30%' />
              </Grid>
              <Grid item xs={9}>
                <Skeleton height={theme.spacing(16)} />
              </Grid>
              <Grid item xs={3}>
                <Skeleton height={theme.spacing(16)} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton height={theme.spacing(4)} width='30%' />
              </Grid>
              <Grid item xs={9}>
                <Skeleton height={theme.spacing(16)} />
              </Grid>
              <Grid item xs={3}>
                <Skeleton height={theme.spacing(16)} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton height={theme.spacing(16)} />
              </Grid>
            </Grid>
          </CardContent>
        ) : null}
        {transaction ? (
          <>
            <CardHeader
              title={<Typography variant='body1'>Multichain Swap</Typography>}
              action={
                <Button onClick={handleReset} startIcon={<ArrowBackIcon />}>
                  Back
                </Button>
              }
            />
            <CardContent>
              <ReviewOrder
                transaction={transaction}
                onReset={handleReset}
                onTransfer={handleTransfer}
              />
            </CardContent>
          </>
        ) : null}
        {goToReceiveAddress ? (
          <>
            <CardHeader
              title={<Typography variant='body1'>Multichain Swap</Typography>}
              action={
                <Button onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
                  Back
                </Button>
              }
            />
            <CardContent>
              <ReceiveAddressStep
                acceptAML={acceptAML}
                onAcceptChange={handleChangeAccept}
                toCoin={toCoin}
                onPaste={handlePaste}
                addressToSend={addressToSend}
                onChange={handleAddressToSendChange}
                onSwap={handleCreateTransaction}
                loading={creatingTransaction}
                onGoBack={handleGoBack}
                transactionError={transactionError}
              />
            </CardContent>
          </>
        ) : null}
        {!loading && !goToReceiveAddress && !transaction ? (
          <>
            <CardContent>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='space-between'>
                <Box display='flex' alignItems='center' alignContent='center'>
                  <Box mr={2}>
                    <IconButton size='small' onClick={handleOpenTransactions}>
                      <Badge
                        color='primary'
                        badgeContent={
                          transactions?.filter(
                            (tx: ChangellyTransaction) =>
                              tx.status == STATUS_WAITING ||
                              tx.status == STATUS_CONFIRMING,
                          ).length
                        }>
                        <HistoryIcon />
                      </Badge>
                    </IconButton>
                  </Box>
                  <Typography variant='body1'>Multichain Swap</Typography>
                </Box>

                <IconButton onClick={onClose} size='small'>
                  <Close />
                </IconButton>
              </Box>
            </CardContent>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='body1'>You Send</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <CoinSelectButton
                            symbol={fromCoin?.name || ''}
                            iconImage={fromCoin?.image || ''}
                            onClick={handleFromSelectToken}
                          />
                        </Grid>
                        <Grid item xs>
                          <TextField
                            disabled={fromLoading}
                            id='from-amount'
                            type='number'
                            variant='outlined'
                            placeholder='0.00'
                            value={fromAmountValue}
                            onChange={onChangeFromAmount}
                            fullWidth
                            inputProps={{
                              step: 0.0000001,
                              min: 0,
                            }}
                            InputProps={{
                              endAdornment: fromLoading ? (
                                <InputAdornment position='end'>
                                  <CircularProgress
                                    color='inherit'
                                    size='1rem'
                                  />
                                </InputAdornment>
                              ) : null,
                            }}
                            error={!isFromAmountValid()}
                            helperText={
                              !isFromAmountValid()
                                ? `Minimum Amount ${minFromAmount} ${fromCoin?.name.toUpperCase()}`
                                : ''
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    pt={2}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'>
                    <IconButton
                      color='primary'
                      size='small'
                      onClick={onSwitchCoin}>
                      <ArrowDownwardIcon fontSize='inherit' />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12}>
                      <Typography variant='body1'>You Receive</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <CoinSelectButton
                            symbol={toCoin?.name || ''}
                            iconImage={toCoin?.image || ''}
                            onClick={handleToSelectToken}
                          />
                        </Grid>
                        <Grid item xs>
                          <TextField
                            disabled={toLoading}
                            id='to-amount'
                            type={'number'}
                            variant='outlined'
                            placeholder='0.00'
                            value={toAmountValue}
                            onChange={onChangeToAmount}
                            fullWidth
                            inputProps={{
                              step: 0.0000001,
                              min: 0,
                            }}
                            InputProps={{
                              endAdornment: toLoading ? (
                                <InputAdornment position='end'>
                                  <CircularProgress
                                    color='inherit'
                                    size='1rem'
                                  />
                                </InputAdornment>
                              ) : null,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {toAmount > 0 && fromAmount > 0 ? (
                  <Grid item xs={12}>
                    <Typography color='textSecondary' variant='body2'>
                      {toLoading || fromLoading ? (
                        <Skeleton width='40%' />
                      ) : (
                        getPriceRatioText()
                      )}
                    </Typography>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    fullWidth
                    startIcon={<ArrowForward />}
                    disabled={
                      disabledButton ||
                      fromLoading ||
                      toLoading ||
                      !isFromAmountValid()
                    }
                    onClick={handleGoToReceiveAddress}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </>
        ) : null}
      </Card>
    </>
  );
};

export default SwapComponent;
