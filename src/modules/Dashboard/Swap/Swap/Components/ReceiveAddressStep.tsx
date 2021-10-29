import React from 'react';

import {useIntl} from 'react-intl';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useTheme} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import {ReceiveAddressInput} from './ReceiveAddressInput';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import {Alert} from '@material-ui/lab';

interface Props {
  toCoin: any;
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
  const {messages} = useIntl();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='body1'>
          {messages['app.receiveAddress']}
        </Typography>
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
