import React from 'react';

import {Grid, LinearProgress, Typography} from '@material-ui/core';

type Props = {to: number; from: number};

const LinearProgressWithLabel: React.FC<Props> = (props) => {
  const {to, from} = props;

  return (
    <Grid
      container
      spacing={2}
      style={{
        padding: 5,
        borderRadius: 8,
        paddingTop: 15,
        backgroundColor: '#2E3243',
      }}>
      <Grid item xs={12}>
        <LinearProgress
          style={{borderRadius: 10}}
          variant='determinate'
          value={((from > 200 ? 200: from) / to)  * 100}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container justifyContent='space-between' spacing={3}>
          <Grid item xs={2}>
            <Typography variant='body2'>{from} KIT</Typography>
          </Grid>

          <Grid item xs={8} />

          <Grid item xs={2} alignContent='flex-end'>
            <Typography variant='body2' style={{float: 'right'}}>
              {to} KIT
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LinearProgressWithLabel;
