import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  Checkbox,
  InputAdornment,
  TextField,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {Changelly} from 'services/rest/changelly';
import {ChangellyCoin, ChangellyTransaction} from 'types/changelly';

import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {ReceiveAddressInput} from './Components/ReceiveAddressInput';
import {Steps} from './Provider';
import {ReviewOrder} from './Components/ReviewOrder';
import {SelectCoinsDialog} from './Modal/SelectCoins';

import _ from 'lodash';
import {CoinSelectButton} from './Components/CoinSelectButton';
import {ReceiveAddressStep} from './Components/ReceiveAddressStep';

export const SwapComponent = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [step, setStep] = useState(Steps.Exchange);
  const [acceptAML, setAcceptAML] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);
  const [coins, setCoins] = useState<ChangellyCoin[]>([]);
  const [fromCoin, setFromCoin] = useState<ChangellyCoin>();
  const [toCoin, setToCoin] = useState<ChangellyCoin>();
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [minFromAmount, setMinFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [addressToSend, setAddressToSend] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<ChangellyTransaction | null>(
    null,
  );
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [goToReceiveAddress, setGoToReceiveAddress] = useState(false);

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

      const r = await Changelly.getMinAmount({
        from: eth.ticker,
        to: btc.ticker,
      });

      if (r.result) {
        const newAmount = Number(r.result);
        setMinFromAmount(newAmount);
        setFromAmount(newAmount);
        setToLoading(true);

        const res = await Changelly.getExchangeAmount({
          from: eth.ticker,
          to: btc.ticker,
          amount: newAmount.toString(),
        });

        if (res.result) {
          const am = Number(res.result);
          setToAmount(am);
        }
        setToLoading(false);
      } else {
        return;
      }
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
        from: toCoin.ticker,
        to: fromCoin.ticker,
      });

      setFromLoading(false);

      if (r.result) {
        const newAmount = Number(r.result);

        setMinFromAmount(newAmount);
        setFromAmount(newAmount);

        setToLoading(true);

        const res = await Changelly.getExchangeAmount({
          from: toCoin.ticker,
          to: fromCoin.ticker,
          amount: newAmount.toString(),
        });

        if (res.result) {
          const am = Number(res.result);
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

    fetchCoinsAmounts();
  }, [fetchCoinsAmounts, toCoin, fromCoin]);

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
      setFromAmount(amount);
      calculateFromRatio(e.target.value);
    },
    [setFromAmount, calculateFromRatio],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = Number(e.target.value);
      setToAmount(amount);
      console.log('entra aqui5');
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
    let to = toCoin?.name?.toUpperCase();
    let from = fromCoin?.name.toUpperCase();

    let ratio = Number(fromAmount) / Number(toAmount);

    return `1 ${to} ≈ ${ratio.toFixed(8)} ${from}`;
  }, [toAmount, fromAmount, toCoin, fromCoin]);

  const disabledButton =
    step === Steps.SetWallet && (!validAddress || !acceptAML);

  const isFromAmountValid = useCallback(() => {
    return fromAmount >= minFromAmount;
  }, [fromAmount, minFromAmount]);

  const handleCreateTransaction = useCallback(() => {
    setCreatingTransaction(true);

    if (fromCoin && toCoin) {
      Changelly.createTransaction({
        from: fromCoin.ticker,
        to: toCoin.ticker,
        amount: fromAmount.toString(),
        address: addressToSend,
      })
        .then((r) => {
          setTransaction(r.result as ChangellyTransaction);
          setGoToReceiveAddress(false);
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
        if (coin == fromCoin) {
          setFromCoin(toCoin);
        }

        setToCoin(coin);
      } else {
        if (coin == toCoin) {
          setToCoin(fromCoin);
        }

        setFromCoin(coin);
      }

      setSelectTo('');
      setShowSelectCoin(false);
      fetchCoinsAmounts();
    },
    [fetchCoinsAmounts, selectTo, fromCoin, toCoin],
  );

  const handleCancelSelectCoin = useCallback(() => {
    setShowSelectCoin(false);
    setSelectTo('');
  }, []);

  const handleReset = useCallback(() => {
    setTransaction(null);
    setAddressToSend('');
    setGoToReceiveAddress(false);
    setAcceptAML(false);

    fetchCoinsAmounts();
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

  return (
    <>
      <SelectCoinsDialog
        coins={coins}
        open={showSelectCoin}
        onSelectCoin={handleSelectCoin}
        onClose={handleCancelSelectCoin}
        selectTo={selectTo}
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
        {fromCoin && toCoin && transaction && acceptAML ? (
          <CardContent>
            <ReviewOrder
              fromCoin={fromCoin}
              toCoin={toCoin}
              transaction={transaction}
              onReset={handleReset}
            />
          </CardContent>
        ) : null}
        {goToReceiveAddress ? (
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
            />
          </CardContent>
        ) : null}
        {!loading && !goToReceiveAddress && !transaction ? (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container alignItems='center' spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='body1'>You Send</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <TextField
                          disabled={fromLoading}
                          id='from-amount'
                          type='number'
                          variant='outlined'
                          placeholder='0.00'
                          value={fromAmount}
                          onChange={onChangeFromAmount}
                          fullWidth
                          inputProps={{
                            step: 0.0000001,
                            min: 0,
                          }}
                          InputProps={{
                            endAdornment: fromLoading ? (
                              <InputAdornment position='end'>
                                <CircularProgress color='inherit' size='1rem' />
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
                      <Grid item>
                        <CoinSelectButton
                          symbol={fromCoin?.name || ''}
                          iconImage={fromCoin?.image || ''}
                          onClick={handleFromSelectToken}
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
                      <Grid item xs>
                        <TextField
                          disabled={toLoading}
                          id='to-amount'
                          type={'number'}
                          variant='outlined'
                          placeholder='0.00'
                          value={toAmount}
                          onChange={onChangeToAmount}
                          fullWidth
                          inputProps={{
                            step: 0.0000001,
                            min: 0,
                          }}
                          InputProps={{
                            endAdornment: toLoading ? (
                              <InputAdornment position='end'>
                                <CircularProgress color='inherit' size='1rem' />
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <CoinSelectButton
                          symbol={toCoin?.name || ''}
                          iconImage={toCoin?.image || ''}
                          onClick={handleToSelectToken}
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
                  disabled={disabledButton || fromLoading || toLoading}
                  onClick={handleGoToReceiveAddress}>
                  Next
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        ) : null}
      </Card>
    </>
  );
};
