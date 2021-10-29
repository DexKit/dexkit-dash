import React from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';

export const LoadingSkeleton = () => {
  const {messages} = useIntl();

  return (
    <Grid container spacing={2} direction='row'>
      <Grid container xs={12} alignItems='center'>
        <Grid item xs={12}>
          <Skeleton>
            <Typography component={'h1'}>{messages['app.youSend']}</Typography>{' '}
          </Skeleton>
        </Grid>
        <Grid item xs={4}>
          <Skeleton>
            <Button
              size='large'
              variant='contained'
              endIcon={<ExpandMoreIcon />}>
              {messages['app.coin']}
            </Button>
          </Skeleton>
        </Grid>
        <Grid item xs={8}>
          <Skeleton>
            <TextField
              id='to-amount'
              type='number'
              variant='filled'
              placeholder='0.00'
              fullWidth
            />
          </Skeleton>
        </Grid>
      </Grid>
      <Grid container xs={12} spacing={2} alignItems='center' />
      <Grid container xs={12} spacing={2} alignItems='center'>
        <Grid item xs={12}>
          <Skeleton>
            <Typography component={'h1'}>
              {messages['app.youReceived']}
            </Typography>
          </Skeleton>
        </Grid>
        <Grid item xs={4}>
          <Skeleton>
            <Button
              size='large'
              variant='contained'
              endIcon={<ExpandMoreIcon />}>
              {messages['app.coin']}
            </Button>
          </Skeleton>
        </Grid>
        <Grid item xs={8}>
          <Skeleton>
            <TextField
              id='from-amount'
              type='number'
              variant='filled'
              placeholder='0.00'
              fullWidth
            />
          </Skeleton>
        </Grid>
      </Grid>
    </Grid>
  );
};
