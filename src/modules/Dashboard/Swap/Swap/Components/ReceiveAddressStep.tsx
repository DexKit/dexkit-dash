import {
  Button,
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  useTheme,
  Link,
} from '@material-ui/core';
import React from 'react';
import {ReceiveAddressInput} from './ReceiveAddressInput';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import {Alert} from '@material-ui/lab';
import {ChangellyCoin} from 'types/changelly';

function getChangellyBlockChainName(blockchain?: string, defaultName?: string) {
  if (blockchain) {
    if (blockchain === 'ethereum') {
      return 'Ethereum';
    } else if (blockchain === 'bitcoin') {
      return 'Bitcoin';
    } else if (blockchain === 'binance_smart_chain') {
      return 'Binance Smart Chain';
    }
  }
  return defaultName;
}

interface Props {
  toCoin?: ChangellyCoin;
  addressToSend: string;
  onChange: (value: string) => void;
  onPaste: (value: string) => void;
  acceptAML: boolean;
  onAcceptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwap: () => void;
  loading: boolean;
  onGoBack: () => void;
  transactionError?: string;
}

export const ReceiveAddressStep = (props: Props) => {
  const {
    toCoin,
    addressToSend,
    onChange,
    onPaste,
    onAcceptChange,
    acceptAML,
    onSwap,
    loading,
    transactionError,
  } = props;
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity='info'>
          NOTE: Changelly will send your tokens to{' '}
          <strong>
            {getChangellyBlockChainName(toCoin?.blockchain, toCoin?.fullName)}
          </strong>{' '}
          network
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>Receive Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <ReceiveAddressInput
          coin={toCoin}
          address={addressToSend}
          onChange={onChange}
          onPaste={onPaste}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <Checkbox
              checked={acceptAML}
              onChange={onAcceptChange}
              inputProps={{'aria-label': 'servicesCheckbox'}}
            />
          </Grid>
          <Grid item xs>
            <Typography color='textSecondary' variant='body2'>
              Service provided by{' '}
              <Link href={'https://changelly.com/'} target={'_blank'}>
                Changelly{' '}
              </Link>
              By proceeding, you acknowledge and understand that the transaction
              may trigger{' '}
              <Link href={'https://changelly.com/aml-kyc'} target={'_blank'}>
                Changelly KYC verification
              </Link>
              . This is usually for transactions of higher value than 0.4 BTC or
              equivalent. Proceeding here will NOT withdraw funds from your
              account nor will you be obliged to continue the transaction”
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {transactionError ? (
        <Grid item xs={12}>
          <Alert severity='error'>{transactionError}</Alert>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Button
          disabled={loading || !acceptAML || addressToSend === ''}
          onClick={onSwap}
          fullWidth
          size='large'
          variant='contained'
          color='primary'
          startIcon={loading ? null : <SwapVertIcon />}>
          {loading ? (
            <CircularProgress size={theme.spacing(6)} color='inherit' />
          ) : (
            'Swap'
          )}
        </Button>
      </Grid>
    </Grid>
  );
};
