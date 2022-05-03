import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Box,
  Paper,
  Typography,
  makeStyles,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';

import {Skeleton} from '@material-ui/lab';
import {useChampionMetadataQuery} from 'modules/CoinLeagues/hooks/champions';
import React, {useCallback, useMemo, useState} from 'react';
import {getNormalizedUrl} from 'utils/browser';
import {useModuleStyle} from '../styles';

import {ReactComponent as UserSquareIcon} from '../assets/user-square.svg';
import CoinSelect from './CoinSelect';
import {useIntl} from 'react-intl';
import {GET_CHAMPIONS_COINS, NFT_LEAGUE_MULTIPLIERS} from '../constants';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {ethers} from 'ethers';
import {useCoinFeed} from '../hooks/useCoinFeed';
import {useProfileGame} from 'modules/CoinLeagues/hooks/useGameProfile';
import {truncateAddress} from 'utils';
import {useChampionPoints} from '../hooks/useChampionPoints';

const useStyle = makeStyles((theme) => ({
  coinSelectImage: {
    height: 'auto',
    width: theme.spacing(20),
  },
  winner: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.success.main,
  },
}));

interface Props {
  tokenId?: string;
  score?: number;
  multiplier?: ethers.BigNumber;
  initialPrice?: ethers.BigNumber;
  endPrice?: ethers.BigNumber;
  coinFeedAddress?: string;
  winner?: boolean;
  state: 'waiting' | 'ended' | 'inprogress';
  account?: string;
  onJoinGame?: (multiplier: number) => void;
  onSelectChampion?: () => void;
  onClearChampion?: () => void;
  isBittokenCoin?: boolean;
  bittValue?: number;
  onChangeBittValue?: (e: any) => void;
}

export const PlayerCoinPaper: React.FC<Props> = ({
  tokenId,
  multiplier,
  initialPrice,
  endPrice,
  coinFeedAddress,
  state,
  score,
  account,
  winner,
  onSelectChampion,
  onClearChampion,
  onJoinGame,
  isBittokenCoin,
  onChangeBittValue,
  bittValue,
}) => {
  const metadataQuery = useChampionMetadataQuery(tokenId);

  const profile = useProfileGame(account);

  const classes = useStyle();

  const {messages} = useIntl();

  const moduleClasses = useModuleStyle();

  const {chainId} = useLeaguesChainInfo();

  const coinFeed = useCoinFeed(coinFeedAddress);

  const [multiplierValue, setMultiplierValue] = useState(
    NFT_LEAGUE_MULTIPLIERS[0],
  );

  const handleChange = useCallback((e: any) => {
    setMultiplierValue(e.target.value);
  }, []);

  const handleJoinGame = useCallback(() => {
    if (onJoinGame) {
      onJoinGame(multiplierValue);
    }
  }, [onJoinGame, multiplierValue]);

  const championPoints = useChampionPoints(tokenId);

  const currPlayerScore = useMemo<number>(() => {
    if (
      coinFeed.data !== undefined &&
      initialPrice !== undefined &&
      multiplier !== undefined &&
      championPoints.data !== undefined
    ) {
      const diff =
        ((coinFeed.data.toNumber() - initialPrice.toNumber()) /
          coinFeed.data.toNumber()) *
        multiplier.toNumber();

      return diff + championPoints.data?.total;
    }

    return 0;
  }, [coinFeed.data, initialPrice, multiplier, championPoints]);

  if (state === 'ended' || state === 'inprogress') {
    return (
      <Box
        p={4}
        height='100%'
        component={Paper}
        className={winner ? classes.winner : undefined}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs>
                <Grid container spacing={4}>
                  <Grid item>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'>
                      {metadataQuery?.isLoading ||
                      !metadataQuery?.data?.image ? (
                        <Skeleton
                          variant='rect'
                          className={classes.coinSelectImage}
                        />
                      ) : (
                        <img
                          src={getNormalizedUrl(metadataQuery?.data?.image)}
                          alt={metadataQuery?.data?.name}
                          className={classes.coinSelectImage}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Grid
                      container
                      alignItems='center'
                      alignContent='center'
                      spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='body2'>
                          <Link
                            component={RouterLink}
                            to={`/coin-league/profile/${account}`}>
                            {profile.data?.username
                              ? profile.data?.username
                              : truncateAddress(account)}
                          </Link>
                        </Typography>
                        <Typography
                          className={moduleClasses.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {metadataQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            metadataQuery.data?.name
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item>
                            <Typography color='textSecondary' variant='body2'>
                              ATK
                            </Typography>
                            <Typography
                              className={moduleClasses.boldText}
                              color='textPrimary'
                              variant='subtitle1'>
                              {championPoints.isLoading ? (
                                <Skeleton />
                              ) : (
                                championPoints.data?.attack
                              )}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography color='textSecondary' variant='body2'>
                              DEF
                            </Typography>
                            <Typography
                              className={moduleClasses.boldText}
                              color='textPrimary'
                              variant='subtitle1'>
                              {championPoints.isLoading ? (
                                <Skeleton />
                              ) : (
                                championPoints.data?.defense
                              )}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography color='textSecondary' variant='body2'>
                              RUN
                            </Typography>
                            <Typography
                              className={moduleClasses.boldText}
                              color='textPrimary'
                              variant='subtitle1'>
                              {championPoints.isLoading ? (
                                <Skeleton />
                              ) : (
                                championPoints.data?.run
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {winner !== undefined && winner && (
                <Grid item>
                  <CrownIcon />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Box
                p={2}
                display='flex'
                alignContent='center'
                alignItems='center'
                justifyContent='space-between'>
                <Typography
                  color='textPrimary'
                  className={moduleClasses.boldText}
                  variant='body1'>
                  {state === 'ended' ? score : currPlayerScore}
                </Typography>
                <Typography color='textPrimary' variant='body1'>
                  <IntlMessages id='nftLeague.score' />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {initialPrice !== undefined ? (
                        ethers.utils.formatUnits(initialPrice, 8)
                      ) : (
                        <Skeleton />
                      )}{' '}
                      USD
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      <IntlMessages id='nftLeague.initialPrice' />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {state === 'ended' ? (
                        ethers.utils.formatUnits(endPrice || 0, 8)
                      ) : coinFeed.data === undefined || coinFeed.isLoading ? (
                        <Skeleton />
                      ) : (
                        ethers.utils.formatUnits(
                          (coinFeed.data as ethers.BigNumber) || 0,
                          8,
                        )
                      )}{' '}
                      USD
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      {state === 'ended' ? (
                        <IntlMessages id='nftLeague.endPrice' />
                      ) : (
                        <IntlMessages id='nftLeague.currentPrice' />
                      )}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {multiplier?.toNumber()}x
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      <IntlMessages id='nftLeague.multiplier' />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    return (
      <Box
        height='100%'
        p={4}
        component={Paper}
        display='flex'
        alignItems='center'
        alignContent='center'
        justifyContent='center'>
        <Box width='100%'>
          <Grid container spacing={4}>
            {onJoinGame ? (
              <>
                <Grid item xs={12}>
                  <CoinSelect
                    variant='outlined'
                    tokenId={tokenId}
                    onClear={onClearChampion}
                    onClick={onSelectChampion}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant='outlined' fullWidth>
                    <InputLabel>
                      <IntlMessages id='nftLeague.multiplier' />
                    </InputLabel>
                    <Select
                      variant='outlined'
                      onChange={handleChange}
                      value={multiplierValue}
                      name='multiplier'
                      label={messages['nftLeague.multiplier'] as string}
                      fullWidth>
                      {NFT_LEAGUE_MULTIPLIERS.map(
                        (value: number, index: number) => (
                          <MenuItem key={index} value={value}>
                            {value}x
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                {isBittokenCoin && (
                  <Grid item xs={12}>
                    <FormControl variant='outlined' fullWidth>
                      <InputLabel>
                        <IntlMessages id='nftLeague.coinType' />
                      </InputLabel>
                      <Select
                        label={messages['nftLeague.coinType'] as string}
                        fullWidth
                        variant='outlined'
                        value={bittValue}
                        onChange={onChangeBittValue}
                        name='rarity'>
                        {GET_CHAMPIONS_COINS(chainId).map(
                          (coin: string, index: number) => (
                            <MenuItem value={index}>{coin}</MenuItem>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    disabled={tokenId === undefined}
                    onClick={handleJoinGame}
                    variant='contained'
                    color='primary'>
                    <IntlMessages id='nftLeague.joinGame' />
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    justifyContent='center'>
                    <UserSquareIcon />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align='center'
                    color='textSecondary'
                    variant='body1'>
                    <IntlMessages id='nftLeague.waitingOpponent' />
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    );
  }
};
