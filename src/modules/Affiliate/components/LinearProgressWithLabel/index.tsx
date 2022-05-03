import React from 'react';

import {Grid, LinearProgress, Typography, Paper, Box} from '@material-ui/core';

type Props = {to: number; from: number};

const AffiliateProgressCard: React.FC<Props> = (props) => {
  const {to, from} = props;

  return (
    <Paper variant='outlined'>
      <Box p={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LinearProgress
              variant='determinate'
              value={((from > 200 ? 200 : from) / to) * 100}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent='space-between' spacing={3}>
              <Grid item>
                <Typography variant='body2'>{from} KIT</Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2'>{to} KIT</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AffiliateProgressCard;
