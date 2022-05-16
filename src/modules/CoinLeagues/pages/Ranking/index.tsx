import React, {useCallback, useState} from 'react';

import {useHistory} from 'react-router-dom';
import {Grid, IconButton, Typography, Divider} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from 'modules/CoinLeagues/components/RankingLeaguesButton';
import {
  RankingType,
  useRanking,
} from 'modules/CoinLeagues/hooks/useRankingLeagues';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {RoomType} from 'modules/CoinLeagues/constants/enums';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {ChainSelect} from 'modules/CoinLeagues/components/ChainSelect';
import {useMobile} from 'hooks/useMobile';
import RankingButtonSkeleton from 'modules/CoinLeagues/components/RankingButton/index.skeleton';
import {useGameProfilesState} from 'modules/CoinLeagues/hooks/useGameProfilesState';

export function Ranking() {
  const isMobile = useMobile();
  const [room, setRoom] = useState(RoomType.Main);
  const isNFT = room === RoomType.Main ? false : true;
  const {coinSymbol, chainId} = useLeaguesChainInfo();
  const [value, setValue] = React.useState(RankingType.MostWinner);
  const rankingQuery = useRanking(value, isNFT, chainId);

  const {account} = useWeb3();

  const history = useHistory();
  const {messages} = useIntl();

  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: RankingType) => {
      setValue(newValue);
    },
    [],
  );

  const userProfiles = useGameProfilesState(
    rankingQuery.data?.players.map((p) => p.id.toLowerCase()),
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
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
              {!isMobile && (
                <>
                  <Box p={2}>
                    <FormControl>
                      <Select
                        variant='outlined'
                        value={room}
                        onChange={(e) => setRoom(e.target.value as RoomType)}
                        renderValue={(value) => <> {value}</>}>
                        <MenuItem value={RoomType.Main}>
                          {RoomType.Main}{' '}
                        </MenuItem>
                        <MenuItem value={RoomType.NFT}>{RoomType.NFT}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box p={2}>
                    <ChainSelect />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        {isMobile && (
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select
                    fullWidth
                    variant='outlined'
                    value={room}
                    onChange={(e) => setRoom(e.target.value as RoomType)}
                    renderValue={(value) => <> {value}</>}>
                    <MenuItem value={RoomType.Main}>{RoomType.Main} </MenuItem>
                    <MenuItem value={RoomType.NFT}>{RoomType.NFT}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <ChainSelect fullWidth />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} sm={8}>
          <CustomTabs
            scrollButtons='auto'
            value={value}
            onChange={handleChange}
            variant='scrollable'
            TabIndicatorProps={{
              style: {display: 'none'},
            }}
            aria-label='wallet tabs'>
            <CustomTab
              value={RankingType.MostWinner}
              label={RankingType.MostWinner}
            />
            <CustomTab
              value={RankingType.MostJoined}
              label={RankingType.MostJoined}
            />
            <CustomTab
              value={RankingType.MostEarned}
              label={RankingType.MostEarned}
            />
            <CustomTab
              value={RankingType.MostProfit}
              label={RankingType.MostProfit}
            />
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
        {value === RankingType.MostWinner && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
              <Grid container spacing={4}>
                {rankingQuery.loading &&
                  Array.from(Array(10).keys()).map(() => (
                    <Grid item xs={12}>
                      <RankingButtonSkeleton />
                    </Grid>
                  ))}

                {rankingQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={messages['app.coinLeagues.wins'] as string}
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
                      count={Number(player.totalWinnedGames)}
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
        )}
        {value === RankingType.MostJoined && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                <IntlMessages id='app.coinLeagues.ranking' />
              </Typography>
              <Grid container spacing={4}>
                {rankingQuery.loading &&
                  Array.from(Array(10).keys()).map(() => (
                    <Grid item xs={12}>
                      <RankingButtonSkeleton />
                    </Grid>
                  ))}
                {rankingQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={'Joins'}
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
        )}
        {value === RankingType.MostEarned && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                <IntlMessages
                  id='coinLeague.ranking'
                  defaultMessage='Ranking'
                />
              </Typography>
              <Grid container spacing={4}>
                {rankingQuery.loading &&
                  Array.from(Array(10).keys()).map(() => (
                    <Grid item xs={12}>
                      <RankingButtonSkeleton />
                    </Grid>
                  ))}
                {rankingQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      label={`Earned  ${coinSymbol}:`}
                      joinsCount={Number(player.totalJoinedGames)}
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
                      profile={userProfiles?.profiles?.find(
                        (p) =>
                          p?.address.toLowerCase() === player?.id.toLowerCase(),
                      )}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      EarnedMinusSpent={Number(
                        ethers.utils.formatEther(player.EarnedMinusSpent),
                      )}
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
        {value === RankingType.MostProfit && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                Ranking
              </Typography>
              <Grid container spacing={4}>
                {rankingQuery.loading &&
                  Array.from(Array(10).keys()).map(() => (
                    <Grid item xs={12}>
                      <RankingButtonSkeleton />
                    </Grid>
                  ))}
                {rankingQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
                      profile={userProfiles?.profiles?.find(
                        (p) =>
                          p?.address.toLowerCase() === player?.id.toLowerCase(),
                      )}
                      label={`Profit  ${coinSymbol}:`}
                      joinsCount={Number(player.totalJoinedGames)}
                      winsCount={Number(player.totalWinnedGames)}
                      firstCount={Number(player.totalFirstWinnedGames)}
                      secondCount={Number(player.totalSecondWinnedGames)}
                      thirdCount={Number(player.totalThirdWinnedGames)}
                      totalEarned={Number(
                        ethers.utils.formatEther(player.totalEarned),
                      )}
                      EarnedMinusSpent={Number(
                        ethers.utils.formatEther(player.EarnedMinusSpent),
                      )}
                      count={Number(
                        ethers.utils.formatEther(player.EarnedMinusSpent),
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
