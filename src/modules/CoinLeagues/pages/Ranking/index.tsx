import React, {useCallback} from 'react';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {
  Box,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from 'modules/CoinLeagues/components/RankingLeaguesButton';
import {
  useRankingMostWinned,
  useRankingMostJoined,
  useRankingMostEarned,
} from 'modules/CoinLeagues/hooks/useRankingLeagues';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {ethers} from 'ethers';

enum Tabs {
  MostWinner = 'Most Winner',
  MostJoined = 'Most Joined',
  MostEarned = 'Most Earned',
}

export function Ranking() {
  const rankingMostWinnedQuery = useRankingMostWinned();
  const rankingMostJoinedQuery = useRankingMostJoined();
  const rankingMostEarnedQuery = useRankingMostEarned();
  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();
  const {messages} = useIntl();

  const [value, setValue] = React.useState(Tabs.MostWinner);

  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: Tabs) => {
      setValue(newValue);
    },
    [value],
  );

  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                <IntlMessages id='app.coinLeagues.coinLeague' />
              </Link>
            </Breadcrumbs>
          </Grid>
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
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            variant='standard'
            TabIndicatorProps={{
              style: {display: 'none'},
            }}
            aria-label='wallet tabs'>
            <CustomTab value={Tabs.MostWinner} label={Tabs.MostWinner} />
            <CustomTab value={Tabs.MostJoined} label={Tabs.MostJoined} />
            <CustomTab value={Tabs.MostEarned} label={Tabs.MostEarned} />
          </CustomTabs>
        </Grid>

        {/*<Grid item xs={12}>
          <Typography gutterBottom variant='h6'>
            Your position
          </Typography>
          <RankingButton
            position={1}
            address='0xasd87asd79asd7sa8d7as8dad'
            onClick={(address) => {}}
          />
        </Grid> */}
        {value === Tabs.MostWinner && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
              <Grid container spacing={4}>
                {rankingMostWinnedQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={messages['app.coinLeagues.wins'] as string}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      count={Number(player.totalWinnedGames)}
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
        )}
        {value === Tabs.MostJoined && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
              <Grid container spacing={4}>
                {rankingMostJoinedQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={'Joins'}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      count={Number(player.totalJoinedGames)}
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
        )}
        {value === Tabs.MostEarned && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                Ranking
              </Typography>
              <Grid container spacing={4}>
                {rankingMostEarnedQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={'Earned Matic:'}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      totalEarned={Number(
                        ethers.utils.formatEther(player.totalEarned),
                      )}
                      count={Number(
                        ethers.utils.formatEther(player.totalEarned),
                      )}
                      onClick={(address) => {}}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>{' '}
          </>
        )}
      </Grid>
    </Box>
  );
}

export default Ranking;
