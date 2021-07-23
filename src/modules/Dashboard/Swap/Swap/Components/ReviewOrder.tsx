import {
  Box,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  LinearProgress,
  Button,
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
        return 'Waiting for deposit';
      case 'confirming':
        return 'Confirming transaction';
      case 'hold':
        return 'Transaction need verification';
      default:
        return '';
    }
  }, []);

  return status == 'finished' ? (
    <OrderFinished onReset={onReset} />
  ) : (
    <Grid container alignItems='center' spacing={1} direction={'row'}>
      <Grid item xs={12}>
        <Box mb={4}>
          <Typography variant='h5'>{getStatusMessage(status)}</Typography>
          <Box pt={2}>
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
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>You send</Typography>
        <Typography variant='h4'>
          {transaction?.amountExpectedFrom} {fromCoin.name.toUpperCase()}{' '}
          <ButtonCopy
            copyText={transaction?.amountExpectedFrom}
            titleText={transaction?.amountExpectedFrom}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>You Receive</Typography>
        <Typography variant='h4'>
          {transaction?.amountExpectedTo} {toCoin.name.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption'>Transaction ID</Typography>
        <Typography variant='h5'>
          {transaction?.id}{' '}
          <ButtonCopy copyText={transaction?.id} titleText={transaction?.id} />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box py={8}>
          <Box p={4}>
            <Typography
              color='textSecondary'
              gutterBottom
              align='center'
              variant='body1'>
              Please, send{' '}
              <strong>
                {transaction?.amountExpectedFrom} {fromCoin.name.toUpperCase()}
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
      <Grid item xs={12}>
        <Button onClick={onReset} size='large' fullWidth variant='outlined'>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};
