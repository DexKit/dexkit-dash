import React from 'react';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface Props {
  traitType: string;
  value: string;
}

export function ChampionTrait(props: Props) {
  const {traitType, value} = props;
  return (
    <Paper variant='outlined'>
      <Box p={4}>
        <Typography align='center' variant='overline'>
          {traitType}
        </Typography>
        <Typography align='center' variant='body1'>
          <strong>{value}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}

export default ChampionTrait;
