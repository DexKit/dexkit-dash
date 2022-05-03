import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Paper, Typography} from '@material-ui/core';
import React from 'react';

const GameDescriptionPaper: React.FC = () => {
  return (
    <Box p={4} component={Paper}>
      <Typography color='textPrimary' variant='body1'>
        <IntlMessages id='nftLeague.nftLeague' />
      </Typography>
      <Typography color='textSecondary' variant='body2'>
        <IntlMessages id='nftLeague.nftLeagueDescription' />
      </Typography>
    </Box>
  );
};

export default React.memo(GameDescriptionPaper);
