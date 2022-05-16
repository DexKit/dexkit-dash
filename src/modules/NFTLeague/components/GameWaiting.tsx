import IntlMessages from '@crema/utility/IntlMessages';
import {
  Paper,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {NFT_LEAGUE_MULTIPLIERS} from '../constants';
import {useModuleStyle} from '../styles';
import CoinSelect from './CoinSelect';
import GameDescriptionPaper from './GameDescriptionPaper';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

interface Props {
  id?: string;
}

export const GameWaiting: React.FC<Props> = ({}) => {
  const {messages} = useIntl();

  const classes = useModuleStyle();

  const [multiplier, setMultiplier] = useState(NFT_LEAGUE_MULTIPLIERS[0]);

  const handleChangeMultiplier = useCallback(
    (e: React.ChangeEvent<{value?: unknown}>) => {
      if (e.target.value) {
        setMultiplier(e.target.value as number);
      }
    },
    [],
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <GameDescriptionPaper />
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item xs={12}>
          <Typography
            color='textPrimary'
            className={classes.boldText}
            variant='subtitle1'>
            <IntlMessages id='nftLeague.gameInformation' />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box p={4} component={Paper}>
            <Typography color='textSecondary' variant='body2'>
              <IntlMessages id='nftLeague.entryAmount' />
            </Typography>
            <Typography
              className={classes.boldText}
              color='textPrimary'
              variant='subtitle1'>
              330 MATIC
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box p={4} component={Paper}>
            <Typography color='textSecondary' variant='body2'>
              <IntlMessages id='nftLeague.gameType' />
            </Typography>
            <Typography
              className={classes.boldText}
              color='textPrimary'
              variant='subtitle1'>
              Bear
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            color='textPrimary'
            className={classes.boldText}
            variant='subtitle1'>
            <IntlMessages id='nftLeague.chooseYourNft' />
          </Typography>
          <Typography variant='body1'>
            <IntlMessages id='nftLeague.chooseAnNftThatYouThinkWillGoUpOrDown' />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5}></Grid>
        <Grid item xs={12}>
          <Typography
            color='textPrimary'
            className={classes.boldText}
            variant='subtitle1'>
            <IntlMessages id='nftLeague.multiplyYourPower' />
          </Typography>
          <Typography variant='body1'>
            <IntlMessages id='nftLeague.multiplyYourPowerDescription' />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant='outlined' fullWidth>
            <InputLabel>
              <IntlMessages id='nftLeague.multiplier' />
            </InputLabel>
            <Select
              variant='outlined'
              onChange={handleChangeMultiplier}
              value={multiplier}
              label={messages['nftLeague.multiplier'] as string}
              fullWidth>
              {NFT_LEAGUE_MULTIPLIERS.map((value: number, index: number) => (
                <MenuItem key={index} value={value}>
                  {value}x
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            startIcon={<ArrowForwardIcon />}
            variant='contained'
            color='primary'>
            <IntlMessages id='nftLeague.joinGame' />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GameWaiting;
