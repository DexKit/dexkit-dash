import React, {useMemo, useState} from 'react';

import {useHistory} from 'react-router-dom';
import {Grid, IconButton, Typography, Divider} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from 'modules/CoinLeague/components/RankingLeaguesButton';
import {
  RankingType,
  useRankingCompetion,
} from 'modules/CoinLeague/hooks/useRankingLeagues';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {BigNumber, ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import RankingButtonSkeleton from 'modules/CoinLeague/components/RankingButton/index.skeleton';
import {useGameProfilesState} from 'modules/CoinLeague/hooks/useGameProfilesState';
import {Months} from 'modules/CoinLeague/constants';
import {ChainId} from 'types/blockchain';
import {useCoinToPlayStable} from 'modules/CoinLeague/hooks/useCoinToPlay';

export function Competition() {
  const [month, setMonth] = useState(Months.June);
  const isNFT = false;

  const query = useRankingCompetion(
    RankingType.MostJoined,
    isNFT,
    ChainId.Matic,
    month,
  );
  const {account} = useWeb3();

  const coinToPlayStable = useCoinToPlayStable(ChainId.Matic);
  const coinSymbol = coinToPlayStable?.symbol.toUpperCase() || '';
  const decimals = coinToPlayStable?.decimals;

  const history = useHistory();
  const {messages} = useIntl();
  const playersData = query.data?.data?.players;
  const playersPastData = query.data?.data?.pastPlayers;

  const players = useMemo(() => {
    if (playersData && playersPastData) {
      return playersData.map((pl) => {
        if (month === Months.February) {
          return pl;
        }
        const pastPlayer = playersPastData.find(
          (pa) => pa.id.toLowerCase() === pl.id.toLowerCase(),
        );
        // Player is not finded on top 1000 records we assume he is not on the ranking
        if (!pastPlayer) {
          return {
            ...pl,
          };
        } else {
          return {
            id: pl.id,
            totalWinnedGames: BigNumber.from(pl.totalWinnedGames)
              .sub(pastPlayer.totalWinnedGames)
              .toString(),
            totalFirstWinnedGames: BigNumber.from(pl.totalFirstWinnedGames)
              .sub(pastPlayer.totalFirstWinnedGames)
              .toString(),
            totalThirdWinnedGames: BigNumber.from(pl.totalThirdWinnedGames)
              .sub(pastPlayer.totalThirdWinnedGames)
              .toString(),
            totalSecondWinnedGames: BigNumber.from(pl.totalSecondWinnedGames)
              .sub(pastPlayer.totalSecondWinnedGames)
              .toString(),
            totalEarned: BigNumber.from(pl.totalEarned)
              .sub(pastPlayer.totalEarned)
              .toString(),
            EarnedMinusSpent: BigNumber.from(pl.EarnedMinusSpent)
              .sub(pastPlayer.EarnedMinusSpent)
              .toString(),
            totalJoinedGames: BigNumber.from(pl.totalJoinedGames)
              .sub(pastPlayer.totalJoinedGames)
              .toString(),
          };
        }
      });
    }
  }, [playersData, playersPastData, month]);

  const userProfiles = useGameProfilesState(
    players?.map((p) => p.id.toLowerCase()),
  );

  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' alignContent='center'>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                mr={2}>
                <IconButton size='small' onClick={() => history.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Typography variant='h5'>
                <IntlMessages
                  id='app.coinLeagues.competition'
                  defaultMessage={'Competition'}
                />
              </Typography>
              <Box p={2}>
                <FormControl>
                  <Select
                    variant='outlined'
                    value={month}
                    onChange={(e) => setMonth(e.target.value as Months)}
                    renderValue={(value) => <> {value}</>}>
                    {Object.keys(Months).map((M: string, index: number) => (
                      <MenuItem value={M}>{M}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant='h6'>
              <IntlMessages
                id='app.coinLeagues.ranking'
                defaultMessage={'Ranking'}
              />
            </Typography>
            <Grid container spacing={4}>
              {query.isLoading &&
                Array.from(Array(10).keys()).map(() => (
                  <Grid item xs={12}>
                    <RankingButtonSkeleton />
                  </Grid>
                ))}

              {players
                ?.sort(
                  (a, b) =>
                    Number(b.totalJoinedGames) - Number(a.totalJoinedGames),
                )
                ?.filter((p) => Number(p.totalJoinedGames) > 0)
                ?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={messages['app.coinLeagues.mostJoins'] as string}
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
                      profile={userProfiles?.profiles?.find(
                        (p) =>
                          p?.address.toLowerCase() === player?.id.toLowerCase(),
                      )}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      count={Number(player.totalJoinedGames)}
                      EarnedMinusSpent={Number(
                        ethers.utils.formatUnits(
                          player.EarnedMinusSpent,
                          decimals,
                        ),
                      )}
                      totalEarned={Number(
                        ethers.utils.formatUnits(player.totalEarned, decimals),
                      )}
                      onClick={(address) => {}}
                      coinSymbol={coinSymbol}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>{' '}
        </>
      </Grid>
    </Box>
  );
}

export default Competition;
