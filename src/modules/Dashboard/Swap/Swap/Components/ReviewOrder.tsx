import {
  Box,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  LinearProgress,
} from '@material-ui/core';
import useInterval from 'hooks/useInterval';
import React, {useEffect, useState, useCallback} from 'react';
import {Changelly} from 'services/rest/changelly';
import ButtonCopy from 'shared/components/ButtonCopy';
import {ChangellyCoin, ChangellyTransaction} from 'types/changelly';
import {truncateAddress} from 'utils';
import OrderFinished from './OrderFinished';

interface Props {
  fromCoin: ChangellyCoin;
  toCoin: ChangellyCoin;
  transaction: ChangellyTransaction;
  onReset: () => void;
}

export const ReviewOrder = (props: Props) => {
  const {fromCoin, toCoin, transaction, onReset} = props;
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (transaction) {
      Changelly.getStatus(transaction.id).then((r) => setStatus(r.result));
    }
  }, [transaction]);

  useInterval(() => {
    if (transaction) {
      Changelly.getStatus(transaction.id).then((r) => setStatus(r.result));
    }
  }, 30000);

  const getStatusMessage = useCallback((status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting deposit';
      case 'confirming':
        return 'Waiting deposit';
      default:
        return '';
    }
  }, []);

  return status == 'finished' ? (
    <OrderFinished onReset={onReset} />
  ) : (
    <Grid container xs={12} alignItems='center' spacing={1} direction={'row'}>
      <Grid item xs={12}>
        <Box mb={2}>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <LinearProgress value={100} variant='determinate' />
              </Grid>
              <Grid item xs={3}>
                <LinearProgress
                  variant={
                    status == 'waiting' ? 'indeterminate' : 'determinate'
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <LinearProgress
                  variant={
                    status == 'confirming' ? 'indeterminate' : 'determinate'
                  }
                  value={status != 'confirming' ? 0 : 100}
                />
              </Grid>
            </Grid>
          </Box>
          <Typography variant='caption'>{getStatusMessage(status)}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>You send</Typography>
        <Typography variant='h4'>
          {transaction?.amountExpectedFrom} {fromCoin.name.toUpperCase()}{' '}
          <ButtonCopy
            copyText={transaction?.amountExpectedFrom}
            titleText={transaction?.amountExpectedFrom}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>You Receive</Typography>
        <Typography variant='h4'>
          {transaction?.amountExpectedTo} {toCoin.name.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box py={6}>
          <Typography align='center' variant='subtitle1'>
            Send{' '}
            <strong>
              {transaction?.amountExpectedFrom} {fromCoin.name.toUpperCase()}
            </strong>{' '}
            to this address
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
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1'>KYC Required</Typography>
          <Typography variant='body1'>
            {transaction.kycRequired ? 'yes' : 'no'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1'>Status</Typography>
          <Typography variant='body1'>{status}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1'>Transaction ID</Typography>
          <Typography variant='body1'>
            {transaction?.id}{' '}
            <ButtonCopy
              copyText={transaction?.id}
              titleText={transaction?.id}
            />
          </Typography>
        </Box>
      </Grid>
      {status === 'hold' ? (
        <Grid item xs={12}>
          <Paper variant='outlined'>
            <Box p={4}>
              <Typography variant='body1'>
                Changelly Verification Required
              </Typography>
              <Typography variant='body1'>
                Changelly is a third party application. The transaction you
                requested will be held for you until you are verified.
              </Typography>
              <Typography variant='body1'>To get Verified</Typography>
              <Typography variant='body1'>
                1. send an email to security@changelly.com
              </Typography>
              <Typography variant='body1'>
                2. In the subject line, enter the following information:
                Transaction ID: {transaction?.id}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ) : null}
    </Grid>
  );
};
