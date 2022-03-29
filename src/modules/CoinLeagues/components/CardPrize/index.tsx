import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';

interface Props {
  prizePool?: number;
  loading?: boolean;
}

function CardPrize(props: Props): JSX.Element {
  const {prizePool, loading} = props;
  const {coinSymbol} = useLeaguesChainInfo();

  return (
    <Paper>
      <Box p={4}>
        <Typography variant='caption' color='textSecondary'>
          <IntlMessages id='app.coinLeagues.maxPrizePool' />
        </Typography>
        <Typography variant='subtitle1'>
          {prizePool === undefined ? (
            <Skeleton />
          ) : (
            <>
              {prizePool} {coinSymbol}
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
}

export default CardPrize;
