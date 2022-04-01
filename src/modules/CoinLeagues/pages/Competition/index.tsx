import React, {useMemo, useState} from 'react';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from 'modules/CoinLeagues/components/RankingLeaguesButton';
import {
  RankingType,
  useRankingCompetion,
} from 'modules/CoinLeagues/hooks/useRankingLeagues';

import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {BigNumber, ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useMobile} from 'hooks/useMobile';
import RankingButtonSkeleton from 'modules/CoinLeagues/components/RankingButton/index.skeleton';
import {useGameProfilesState} from 'modules/CoinLeagues/hooks/useGameProfilesState';
import {Months} from 'modules/CoinLeagues/constants';
import {ChainId} from 'types/blockchain';

export function Competition() {
  const isMobile = useMobile();
  const [month, setMonth] = useState(Months.April);
  const isNFT = false;

  const query = useRankingCompetion(
    RankingType.MostJoined,
    isNFT,
    ChainId.Matic,
    month,
  );

  const {listGamesRoute} = useCoinLeaguesFactoryRoutes(isNFT);
  const {account} = useWeb3();

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
          {!isMobile && (
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link
                  color='inherit'
                  component={RouterLink}
                  to={listGamesRoute}>
                  <IntlMessages id='app.coinLeagues.coinLeague' />
                </Link>
              </Breadcrumbs>
            </Grid>
          )}
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
                  id='app.coinLeagues.mostJoinerCompetition'
                  defaultMessage={'Most Joiner Competition'}
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
              <IntlMessages id='app.coinLeagues.ranking' />
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
                        ethers.utils.formatEther(player.EarnedMinusSpent),
                      )}
                      totalEarned={Number(
                        ethers.utils.formatEther(player.totalEarned),
                      )}
                      onClick={(address) => {}}
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
