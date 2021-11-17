import React from 'react';

import {Divider, Box, useTheme, Typography, Grid} from '@material-ui/core';
import moment from 'moment';
import {useMobile} from 'hooks/useMobile';
import CountdownSpan from 'shared/components/CountdownSpan';
import {
  getEventAccessDate,
  getEventCurrentRound,
  getEventEarlyAccessDate,
} from 'modules/CoinLeagues/utils/champions';
import {useWeb3} from 'hooks/useWeb3';

interface CountdownCardCardProps {
  elegible?: boolean;
  tokensAmounts?: {kit: number; bitt: number};
}

export const EarlyAccessCountdownSection = (props: CountdownCardCardProps) => {
  const {elegible, tokensAmounts} = props;

  const theme = useTheme();

  const isMobile = useMobile();

  const {chainId} = useWeb3();

  return (
    <Grid container spacing={4}>
      <Grid item xs={isMobile ? 12 : true}>
        <Box height='100%'>
          <Typography
            style={{
              color: elegible
                ? theme.palette.text.secondary
                : theme.palette.text.disabled,
            }}
            variant='caption'>
            Early Access
          </Typography>
          <Typography
            style={{
              color: elegible
                ? theme.palette.text.primary
                : theme.palette.text.disabled,
            }}
            variant={elegible ? 'h4' : 'body1'}>
            <strong>
              {elegible ? (
                <CountdownSpan
                  toDate={moment.unix(
                    getEventEarlyAccessDate(getEventCurrentRound(), 0, chainId),
                  )}
                />
              ) : (
                'NOT ELEGIBLE'
              )}
            </strong>
          </Typography>
          {!elegible ? (
            <Typography variant='caption'>
              Buy {tokensAmounts?.kit} KIT and {tokensAmounts?.bitt} BITT to
              participate
            </Typography>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={isMobile ? 12 : undefined}>
        <Divider orientation={isMobile ? 'horizontal' : 'vertical'} />
      </Grid>
      <Grid item xs={isMobile ? 12 : true}>
        <Typography color='textSecondary' variant='caption'>
          Normal Access
        </Typography>
        <Typography variant='h4'>
          <strong>
            <CountdownSpan
              toDate={moment.unix(
                getEventAccessDate(getEventCurrentRound(), 0, chainId),
              )}
            />
          </strong>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EarlyAccessCountdownSection;
