import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import Skeleton from '@material-ui/lab/Skeleton';
import {truncateAddress} from 'utils/text';
import { useLeaguesChainInfo } from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));

function SimpleCardGameSkeleton(): JSX.Element {
  const {  coinSymbol } = useLeaguesChainInfo();
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container style={{color: '#7a8398'}}>
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.gameTime' />:
            </Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              <Skeleton>&nbsp;{Math.floor(1 / 3600)}Hrs</Skeleton>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h4'>ID#</Typography>

            <Skeleton>
              <Typography variant='h4'>
                {truncateAddress('0x0000000000000000000000')}
              </Typography>
            </Skeleton>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <SendIcon />
            <Typography
              variant='h6'
              style={{color: '#fcc591', fontWeight: 600}}>
              <Skeleton>
                &nbsp;{1} {coinSymbol}
              </Skeleton>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SimpleCardGameSkeleton;
