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

  const onChangeFromAmount = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!fromCoin || !toCoin) {
      return;
    }
    const amount = Number(ev.target.value);
    setFromAmount(amount);
    setToLoading(true);
    Changelly.getExchangeAmount({
      from: fromCoin?.ticker,
      to: toCoin?.ticker,
      amount: amount.toString(),
    })
      .then((res) => {
        const am = Number(res.result);
        setToAmount(am);
      })
      .finally(() => setToLoading(false));
  };

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

  const onChangeToAmount = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!fromCoin || !toCoin) {
      return;
    }
    const amount = Number(ev.target.value);

    setToAmount(amount);
    setFromLoading(true);

    Changelly.getExchangeAmount({
      from: toCoin?.ticker,
      to: fromCoin?.ticker,
      amount: amount.toString(),
    })
      .then((res) => {
        const am = Number(res.result);
        setFromAmount(am);
      })
      .finally(() => setFromLoading(false));
  };

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
    if (fromCoin && toCoin) {
      Changelly.createTransaction({
        from: fromCoin.ticker,
        to: toCoin.ticker,
        amount: fromAmount.toString(),
        address: addressToSend,
      }).then((r) => {
        setTransaction(r.result as ChangellyTransaction);
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
        setToCoin(coin);
      } else {
        setFromCoin(coin);
      }

      setSelectTo('');
      setShowSelectCoin(false);
      fetchCoinsAmounts();
    },
    [fetchCoinsAmounts, selectTo],
  );

  const handleCancelSelectCoin = useCallback(() => {
    setShowSelectCoin(false);
    setSelectTo('');
  }, []);

  return (
    <>
      <SelectCoinsDialog
        coins={coins}
        open={showSelectCoin}
        onSelectCoin={handleSelectCoin}
        onClose={handleCancelSelectCoin}
      />
      <Card>
        {!loading ? (
          <CardHeader
            title='Multichain Swap'
            action={
              transaction ? (
                <IconButton aria-label='back' onClick={handleCancelTransaction}>
                  <ArrowBackIcon />
                  <Typography component={'p'}>Back</Typography>
                </IconButton>
              ) : null
            }
          />
        ) : null}
        {fromCoin &&
        toCoin &&
        addressToSend &&
        fromAmount &&
        toAmount &&
        transaction ? (
          <CardContent>
            <ReviewOrder
              fromCoin={fromCoin}
              toCoin={toCoin}
              transaction={transaction}
            />
          </CardContent>
        ) : (
          <>
            <CardContent>
              {loading ? (
                <Box
                  py={16}
                  display='flex'
                  justifyContent='center'
                  alignItems='center'>
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    alignContent='center'>
                    <Box mb={4}>
                      <Typography gutterBottom variant='h5'>
                        Loading coins...
                      </Typography>
                    </Box>
                    <CircularProgress
                      color='primary'
                      size={theme.spacing(16)}
                    />
                  </Box>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container alignItems='center' spacing={1}>
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
                              variant='filled'
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
                          <Grid item>
                            <Button
                              size='large'
                              fullWidth
                              variant='contained'
                              onClick={handleFromSelectToken}
                              endIcon={<ExpandMoreIcon />}>
                              {fromCoin?.name.toUpperCase()}
                            </Button>
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
                              variant='filled'
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
                                    <CircularProgress
                                      color='inherit'
                                      size='1rem'
                                    />
                                  </InputAdornment>
                                ) : null,
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              fullWidth
                              size='large'
                              variant='contained'
                              onClick={handleToSelectToken}
                              endIcon={<ExpandMoreIcon />}>
                              {toCoin?.name.toUpperCase()}
                            </Button>
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
                    <Typography variant='body1'>Receive Address</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ReceiveAddressInput
                      coin={toCoin}
                      address={addressToSend}
                      onChange={(add) => setAddressToSend(add)}
                      onPaste={handlePaste}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Checkbox
                          checked={acceptAML}
                          onChange={handleChangeAccept}
                          inputProps={{'aria-label': 'servicesCheckbox'}}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography color='textSecondary' variant='body2'>
                          “Exchange services provided by Changelly. By clicking
                          “Accept”, I acknowledge and understand that my
                          transaction may trigger AML/KYC verification according
                          to Changelly AML/KYC”
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </CardContent>
            {!loading ? (
              <CardActions>
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  fullWidth
                  disabled={
                    disabledButton ||
                    fromLoading ||
                    toLoading ||
                    !acceptAML ||
                    addressToSend == ''
                  }
                  onClick={handleCreateTransaction}>
                  Swap
                </Button>
              </CardActions>
            ) : null}
          </>
        )}
      </Card>
    </>
  );
};
