import React from 'react';

import {useIntl} from 'react-intl';

import {useTheme} from '@material-ui/core';
import {Paper, Box, Typography, Button} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';

interface EarlyAccessCounterCardProps {
  elegible?: boolean;
  onBuyCoins?: () => void;
  tokensAmounts?: {kit: number; bitt: number};
}

export const EarlyAccessCounterCard = (props: EarlyAccessCounterCardProps) => {
  const {elegible, onBuyCoins, tokensAmounts} = props;

  const theme = useTheme();
  const {messages} = useIntl();

  return (
    <Paper style={{height: '100%'}} elevation={elegible ? undefined : 0}>
      <Box
        p={4}
        display='flex'
        alignContent='center'
        alignItems='center'
        justifyContent='space-between'>
        <Box>
          <Typography
            style={{
              color: elegible
                ? theme.palette.text.secondary
                : theme.palette.text.disabled,
            }}
            variant='caption'>
            {messages['app.earlyAccess']}
          </Typography>
          <Typography
            style={{
              color: elegible
                ? theme.palette.text.primary
                : theme.palette.text.disabled,
            }}
            variant={elegible ? 'h4' : 'body1'}>
            {elegible ? '00:00:00' : (messages['app.notEligible'] as string)}
          </Typography>
          {!elegible ? (
            <Typography variant='caption'>
              Buy {tokensAmounts?.kit} KIT and {tokensAmounts?.bitt} BITT to
              participate
            </Typography>
          ) : null}
        </Box>
        <Box>
          {elegible ? (
            <CheckCircle color='primary' style={{fontSize: theme.spacing(8)}} />
          ) : (
            <Button
              onClick={onBuyCoins}
              color='primary'
              variant='contained'
              size='small'>
              {messages['app.buy']}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default EarlyAccessCounterCard;
