import React from 'react';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { strPad } from 'modules/CoinLeagues/utils/time';


export function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor( (time  - (hours * 3600)) /60);
  const seconds =  time - (hours * 3600) - (minutes * 60);

  return (
    <Grid item>
      <Typography variant='subtitle2'>
        in {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}
