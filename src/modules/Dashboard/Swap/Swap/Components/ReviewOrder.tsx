import React, {useCallback, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import useInterval from 'hooks/useInterval';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import {useWeb3} from 'hooks/useWeb3';
import {Changelly} from 'services/rest/changelly';
import ButtonCopy from 'shared/components/ButtonCopy';
import {ChainId} from 'types/blockchain';
import {ChangellyTransaction} from 'types/changelly';
import {useSwapTransactions} from '../../hooks';
import {
  getChangellyStatusMessage,
  STATUS_CONFIRMING,
  STATUS_FAILED,
  STATUS_FINISHED,
  STATUS_HOLD,
  STATUS_WAITING,
} from '../../util';
import OrderFailed from './OrderFailed';
import OrderFinished from './OrderFinished';

interface Props {
  transaction?: ChangellyTransaction;
  onReset: () => void;
  onTransfer: (amount: number, address: string) => void;
}

export const ReviewOrder = (props: Props) => {
  const {transaction, onReset, onTransfer} = props;
  const [status, setStatus] = useState('');
  const {updateStatus} = useSwapTransactions();

  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const isWindowVisible = useIsWindowVisible();

  const handleTransfer = useCallback(() => {
    if (transaction) {
      onTransfer(
        parseFloat(transaction.amountExpectedFrom),
        transaction.payinAddress,
      );
    }
  }, [onTransfer, transaction]);

  useEffect(() => {
    if (transaction) {
      if (isWindowVisible) {
        Changelly.getStatus(transaction.id).then((r) => {
          setStatus(r.result);
          updateStatus(transaction, r.result);
        });
      }
    }
  }, [transaction, isWindowVisible]);

  useInterval(() => {
    if (transaction) {
      if (isWindowVisible) {
        Changelly.getStatus(transaction.id).then((r) => {
          setStatus(r.result);
          updateStatus(transaction, r.result);
        });
      }
    }
  }, 30000);

  if (status === STATUS_FAILED) {
    return <OrderFailed onReset={onReset} />;
  }

  return status === STATUS_FINISHED ? (
    <OrderFinished onReset={onReset} />
  ) : (
    <Grid container alignItems='center' spacing={2}>
      {status === STATUS_HOLD || transaction?.kycRequired ? (
        <Grid item xs={12}>
          <Box mb={4}>
            <Paper variant='outlined'>
              <Box p={4}>
                <Typography align='center' gutterBottom variant='subtitle2'>
                  Changelly Verification Required
                </Typography>
                <Typography gutterBottom variant='body2'>
                  Changelly is a third party application. The transaction you
                  requested will be held for you until you are verified.
                </Typography>
                <Typography align='center' gutterBottom variant='subtitle1'>
                  To Get Verified
                </Typography>
                <Typography variant='body2'>
                  1. send an email to{' '}
                  <Link href='mailto:security@changelly.com'>
                    security@changelly.com
                  </Link>
                </Typography>
                <Typography variant='body2'>
                  2. In the subject line, enter the following information:{' '}
                  <strong>Transaction ID: {transaction?.id}</strong>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Box mb={4}>
            <Typography variant='h5'>
              {getChangellyStatusMessage(status)}
            </Typography>
            <Box pt={2}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <LinearProgress value={100} variant='determinate' />
                </Grid>
                <Grid item xs={3}>
                  <LinearProgress
                    variant={
                      status == STATUS_WAITING ? 'indeterminate' : 'determinate'
                    }
                    value={status === STATUS_CONFIRMING ? 100 : 0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LinearProgress
                    variant={
                      status === STATUS_CONFIRMING
                        ? 'indeterminate'
                        : 'determinate'
                    }
                    value={status !== STATUS_CONFIRMING ? 0 : 100}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant='caption'>You send</Typography>
        <Typography variant='h5'>
          {transaction?.amountExpectedFrom}{' '}
          {transaction?.currencyFrom?.toUpperCase()}{' '}
          <ButtonCopy
            copyText={transaction?.amountExpectedFrom || ''}
            titleText={transaction?.amountExpectedFrom || ''}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>{messages['app.youReceived']}</Typography>
        <Typography variant='h5'>
          {transaction?.amountExpectedTo}{' '}
          {transaction?.currencyTo?.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>
          {messages['app.receiveAddress']}
        </Typography>
        <Typography variant='body1'>{transaction?.payoutAddress}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>
          {messages['app.transaction']} ID
        </Typography>
        <Typography variant='h5'>
          {transaction?.id}{' '}
          <ButtonCopy
            copyText={transaction?.id || ''}
            titleText={transaction?.id || ''}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box p={4}>
          <Typography
            color='textSecondary'
            gutterBottom
            align='center'
            variant='body1'>
            Please, send{' '}
            <strong>
              {transaction?.amountExpectedFrom}{' '}
              {transaction?.currencyFrom.toUpperCase()}
            </strong>{' '}
            to the address below and wait for transaction confirmation
          </Typography>
          <TextField
            fullWidth
            value={transaction?.payinAddress}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <ButtonCopy
                    copyText={transaction?.payinAddress || ''}
                    titleText='Address copied!'
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      {transaction?.currencyFrom.toLowerCase() === 'eth' &&
      status == STATUS_WAITING &&
      chainId === ChainId.Mainnet ? (
        <Grid item xs={12}>
          <Button
            onClick={handleTransfer}
            size='large'
            fullWidth
            variant='contained'
            color='primary'>
            {messages['app.transferNow']}
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};
