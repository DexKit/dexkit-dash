import React, {useCallback} from 'react';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {
  Box,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
  Paper,
  ButtonBase,
  Chip,
  Divider,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from 'modules/CoinLeagues/components/RankingLeaguesButton';
import {
  useRankingMostWinned,
  useRankingMostJoined,
} from 'modules/CoinLeagues/hooks/useRankingLeagues';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

enum Tabs {
  MostWinner = 'Most Winner',
  MostJoined = 'Most Joined',
}

export function Ranking() {
  const rankingMostWinnedQuery = useRankingMostWinned();
  const rankingMostJoinedQuery = useRankingMostJoined();
  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();

  const [value, setValue] = React.useState(Tabs.MostWinner);

  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, _newValue: string) => {
      if (value === Tabs.MostWinner) {
        setValue(Tabs.MostJoined);
      } else {
        setValue(Tabs.MostWinner);
      }
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
                Coin League
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
              <Typography variant='h5'>Ranking</Typography>
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
                Ranking
              </Typography>
              <Grid container spacing={4}>
                {rankingMostWinnedQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={'Wins'}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      count={Number(player.totalWinnedGames)}
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
                Ranking
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
