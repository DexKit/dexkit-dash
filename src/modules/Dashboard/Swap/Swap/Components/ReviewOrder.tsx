import {
  Box,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  LinearProgress,
  Button,
  Link,
} from '@material-ui/core';
import useInterval from 'hooks/useInterval';
import {useTokenList} from 'hooks/useTokenList';
import React, {useEffect, useState, useCallback} from 'react';
import {Changelly} from 'services/rest/changelly';
import ButtonCopy from 'shared/components/ButtonCopy';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChangellyCoin, ChangellyTransaction} from 'types/changelly';
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
  transaction: ChangellyTransaction;
  onReset: () => void;
  onTransfer: (amount: number, address: string) => void;
}

export const ReviewOrder = (props: Props) => {
  const {transaction, onReset, onTransfer} = props;
  const [status, setStatus] = useState('');
  const {updateStatus} = useSwapTransactions();

  const handleTransfer = useCallback(() => {
    onTransfer(
      parseFloat(transaction?.amountExpectedFrom),
      transaction?.payinAddress,
    );
  }, [onTransfer, transaction]);

  useEffect(() => {
    if (transaction) {
      Changelly.getStatus(transaction.id).then((r) => {
        setStatus(r.result);
        updateStatus(transaction, r.result);
      });
    }
  }, [transaction]);

  useInterval(() => {
    if (transaction) {
      Changelly.getStatus(transaction.id).then((r) => {
        setStatus(r.result);
        updateStatus(transaction, r.result);
      });
    }
  }, 30000);

  if (status == STATUS_FAILED) {
    return <OrderFailed onReset={onReset} />;
  }

  return status == STATUS_FINISHED ? (
    <OrderFinished onReset={onReset} />
  ) : (
    <Grid container alignItems='center' spacing={2}>
      {status === STATUS_HOLD ? (
        <Grid item xs={12}>
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
                    value={status == STATUS_CONFIRMING ? 100 : 0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LinearProgress
                    variant={
                      status == STATUS_CONFIRMING
                        ? 'indeterminate'
                        : 'determinate'
                    }
                    value={status != STATUS_CONFIRMING ? 0 : 100}
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
          {transaction?.currencyFrom.toUpperCase()}{' '}
          <ButtonCopy
            copyText={transaction?.amountExpectedFrom}
            titleText={transaction?.amountExpectedFrom}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>You Receive</Typography>
        <Typography variant='h5'>
          {transaction?.amountExpectedTo} {transaction.currencyTo.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>Receive Address</Typography>
        <Typography variant='body1'>{transaction?.payoutAddress}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>Transaction ID</Typography>
        <Typography variant='h5'>
          {transaction?.id}{' '}
          <ButtonCopy copyText={transaction?.id} titleText={transaction?.id} />
        </Typography>
      </Grid>
      {transaction?.kycRequired ? (
        <Grid item xs={12}>
          <Typography variant='caption'>KYC Verification</Typography>
          <Typography variant='body1'></Typography>
        </Grid>
      ) : null}
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
            value={transaction.payinAddress}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <ButtonCopy
                    copyText={transaction.payinAddress}
                    titleText='Address copied!'
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      {transaction?.currencyFrom.toLowerCase() == 'eth' ? (
        <Grid item xs={12}>
          <Button
            onClick={handleTransfer}
            size='large'
            fullWidth
            variant='contained'
            color='primary'>
            Transfer now
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};
