import React, {useState, useCallback, useEffect} from 'react';

import {
  Chip,
  Box,
  Grid,
  Button,
  Typography,
  Drawer,
  IconButton,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge,
  makeStyles,
} from '@material-ui/core';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import Close from '@material-ui/icons/Close';
import {
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from 'modules/CoinLeagues/constants/enums';
import {GameFiltersState} from 'modules/CoinLeagues/hooks/useGamesFilter';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {GET_GAME_ORDER_OPTIONS} from 'modules/CoinLeagues/utils/game';

interface Props {
  show: boolean;
  onClose: () => void;
  filtersState: GameFiltersState;
  disablePlayerFilter?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up('sm')]: {
      width: '30vw',
    },
  },
}));

export const GameFilterDrawer = (props: Props) => {
  const {show, onClose, filtersState, disablePlayerFilter} = props;

  const {messages} = useIntl();

  const classes = useStyles();

  const handleChangeLevel = useCallback(
    (e) => {
      filtersState.setGameLevel(e.target.value);
    },
    [filtersState],
  );

  const handleChangeGameType = useCallback(
    (e) => {
      filtersState.setGameType(e.target.value);
    },
    [filtersState],
  );

  const handleChangeNumberOfPlayers = useCallback((e) => {
    filtersState.setNumberOfPlayers(e.target.value);
  }, []);

  const handleChangeStakeAmount = useCallback(
    (e) => {
      filtersState.setStakeAmount(e.target.value);
    },
    [filtersState],
  );

  const handleChangeDuration = useCallback(
    (e) => {
      filtersState.setDuration(e.target.value);
    },
    [filtersState],
  );

  const handleChangeOrder = useCallback(
    (e) => {
      filtersState.setOrderByGame(e.target.value);
    },
    [filtersState],
  );

  const handleSelectAll = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(false);
  }, [filtersState]);

  const handleToggleBitBoy = useCallback(() => {
    filtersState.setIsMyGames(false);
    filtersState.setIsBitboy(!filtersState.isBitboy);
  }, [filtersState]);

  const handleToggleMyGames = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(!filtersState.isMyGames);
  }, [filtersState]);

  const handleReset = useCallback(() => {
    filtersState.reset();
  }, [filtersState]);

  return (
    <Drawer open={show} anchor='right' onClose={onClose}>
      <Box className={classes.container} p={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box mb={2}>
              <Grid container justify='space-between' alignItems='center'>
                <Grid item>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <FilterSearchIcon style={{}} />
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>
                        <IntlMessages id='app.coinLeagues.filters' />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {filtersState.isModified() ? (
                  <Grid item>
                    <Chip
                      label={
                        <IntlMessages id='app.coinLeagues.filtersApplied' />
                      }
                    />
                  </Grid>
                ) : null}
                <Grid item>
                  <IconButton size='small' onClick={onClose}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={1}
              alignItems='center'
              alignContent='center'>
              <Grid item>
                <Chip
                  size='small'
                  label='All'
                  variant='default'
                  clickable
                  onClick={handleSelectAll}
                  disabled={disablePlayerFilter}
                  color={
                    !filtersState.isBitboy && !filtersState.isMyGames
                      ? 'primary'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item>
                <Chip
                  size='small'
                  label='My Games'
                  clickable
                  disabled={disablePlayerFilter}
                  onClick={handleToggleMyGames}
                  color={filtersState.isMyGames ? 'primary' : 'default'}
                />
              </Grid>
              <Grid item>
                <Chip
                  size='small'
                  label='Bitboy'
                  clickable
                  disabled={disablePlayerFilter}
                  onClick={handleToggleBitBoy}
                  color={filtersState.isBitboy ? 'primary' : 'default'}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.gameType' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.gameType}
                onChange={handleChangeGameType}
                label={messages['app.coinLeagues.gameType'] as string}>
                <MenuItem value={GameType.ALL}>
                  <IntlMessages id='app.coinLeagues.all' />
                </MenuItem>
                <MenuItem value={GameType.Bull}>
                  <IntlMessages id='app.coinLeagues.bull' />
                </MenuItem>
                <MenuItem value={GameType.Bear}>
                  <IntlMessages id='app.coinLeagues.bear' />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.level' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.gameLevel}
                onChange={handleChangeLevel}
                label={messages['app.coinLeagues.level'] as string}>
                <MenuItem value={GameLevel.All}>
                  <IntlMessages id='app.coinLeagues.all' />
                </MenuItem>
                <MenuItem value={GameLevel.Beginner}>
                  <IntlMessages id='app.coinLeagues.beginner' />
                </MenuItem>
                <MenuItem value={GameLevel.Intermediate}>
                  <IntlMessages id='app.coinLeagues.intermediate' />
                </MenuItem>
                <MenuItem value={GameLevel.Advanced}>
                  <IntlMessages id='app.coinLeagues.advanced' />
                </MenuItem>

                <MenuItem value={GameLevel.Expert}>
                  <IntlMessages id='app.coinLeague.expert' />
                </MenuItem>

                <MenuItem value={GameLevel.Master}>
                  <IntlMessages id='app.coinLeague.master' />
                </MenuItem>

                <MenuItem value={GameLevel.GrandMaster}>
                  <IntlMessages id='app.coinLeague.grandMaster' />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.duration' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.duration}
                onChange={handleChangeDuration}
                label={messages['app.coinLeagues.duration'] as string}>
                <MenuItem value={GameDuration.ALL}>
                  <IntlMessages id='app.coinLeagues.all' />
                </MenuItem>
                <MenuItem value={GameDuration.FAST}>
                  <IntlMessages id='app.coinLeagues.1hour' />
                </MenuItem>
                <MenuItem value={GameDuration.MEDIUM}>
                  <IntlMessages id='app.coinLeagues.4hours' />
                </MenuItem>
                <MenuItem value={GameDuration.EIGHT}>
                  <IntlMessages id='app.coinLeagues.8hours' />
                </MenuItem>
                <MenuItem value={GameDuration.DAY}>
                  <IntlMessages id='app.coinLeagues.24hours' />
                </MenuItem>
                <MenuItem value={GameDuration.WEEK}>
                  <IntlMessages id='app.coinLeagues.1week' />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.numberOfPlayers' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.numberOfPlayers}
                onChange={handleChangeNumberOfPlayers}
                label={messages['app.coinLeagues.numberOfPlayers'] as string}>
                <MenuItem value={NumberOfPLayers.ALL}>
                  <IntlMessages id='app.coinLeagues.all' />
                </MenuItem>
                <MenuItem value={NumberOfPLayers.TWO}>
                  <IntlMessages id='app.coinLeagues.two' />
                </MenuItem>
                <MenuItem value={NumberOfPLayers.THREE}>
                  <IntlMessages id='app.coinLeagues.three' />
                </MenuItem>
                <MenuItem value={NumberOfPLayers.FIVE}>
                  <IntlMessages id='app.coinLeagues.five' />
                </MenuItem>
                <MenuItem value={NumberOfPLayers.TEN}>
                  <IntlMessages id='app.coinLeagues.ten' />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.stakeAmount' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.stakeAmount}
                onChange={handleChangeStakeAmount}
                label={messages['app.coinLeagues.stakeAmount'] as string}>
                <MenuItem value={GameStakeAmount.ALL}>
                  <IntlMessages id='app.coinLeagues.all' />
                </MenuItem>
                <MenuItem value={GameStakeAmount.TWO}>
                  <IntlMessages id='app.coinLeagues.two' />
                </MenuItem>
                <MenuItem value={GameStakeAmount.FIVE}>
                  <IntlMessages id='app.coinLeagues.five' />
                </MenuItem>
                <MenuItem value={GameStakeAmount.TEN}>
                  <IntlMessages id='app.coinLeagues.ten' />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.orderBy' />
              </InputLabel>
              <Select
                fullWidth
                value={filtersState.orderByGame}
                onChange={handleChangeOrder}
                label={messages['app.coinLeagues.orderBy'] as string}>
                {GET_GAME_ORDER_OPTIONS().map((opt, index) => (
                  <MenuItem value={opt.value} key={index}>
                    <IntlMessages id={opt.messageId} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {filtersState.isModified() ? (
            <Grid item xs={12}>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                startIcon={<Close />}
                onClick={onClose}>
                Close
              </Button>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Button
              disabled={!filtersState.isModified()}
              fullWidth
              variant='outlined'
              onClick={handleReset}>
              <IntlMessages id='app.coinLeagues.reset' />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default GameFilterDrawer;
