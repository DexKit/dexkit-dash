import React, { useCallback, useState } from 'react';

import { Link as RouterLink, useHistory } from 'react-router-dom';
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
  useRankingMostWinned,
  useRankingMostJoined,
  useRankingMostEarned,
  useRankingMostProfit,
} from 'modules/CoinLeagues/hooks/useRankingLeagues';
import { CustomTab, CustomTabs } from 'shared/components/Tabs/CustomTabs';
import { useCoinLeaguesFactoryRoutes } from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import { useIntl } from 'react-intl';
import { ethers } from 'ethers';
import { useWeb3 } from 'hooks/useWeb3';
import { RoomType } from 'modules/CoinLeagues/constants/enums';
import { useLeaguesChainInfo } from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import { ChainSelect } from 'modules/CoinLeagues/components/ChainSelect';
import { useMobile } from 'hooks/useMobile';

enum Tabs {
  MostWinner = 'Most Winner',
  MostJoined = 'Most Joined',
  MostEarned = 'Most Earned',
  MostProfit = 'Most Profit',
}

export function Ranking() {
  const isMobile = useMobile();
  const [room, setRoom] = useState(RoomType.Main);
  const isNFT = room === RoomType.Main ? false : true;
  const { coinSymbol, chainId } = useLeaguesChainInfo();
  const rankingMostWinnedQuery = useRankingMostWinned(isNFT, chainId);
  const rankingMostJoinedQuery = useRankingMostJoined(isNFT, chainId);
  const rankingMostEarnedQuery = useRankingMostEarned(isNFT, chainId);
  const rankingMostProfitQuery = useRankingMostProfit(isNFT, chainId);

  const { listGamesRoute } = useCoinLeaguesFactoryRoutes(isNFT);
  const { account } = useWeb3();

  const history = useHistory();
  const { messages } = useIntl();

  const [value, setValue] = React.useState(Tabs.MostWinner);

  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: Tabs) => {
      setValue(newValue);
    },
    [],
  );

  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          {!isMobile && <Grid item xs={12}>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                <IntlMessages id='app.coinLeagues.coinLeague' />
              </Link>
            </Breadcrumbs>
          </Grid>}
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
              <Box p={2}>
                <FormControl>
                  <Select
                    variant='outlined'
                    value={room}
                    onChange={(e) => setRoom(e.target.value as RoomType)}
                    renderValue={(value) => <> {value}</>}>
                    <MenuItem value={RoomType.Main}>{RoomType.Main} </MenuItem>
                    <MenuItem value={RoomType.NFT}>{RoomType.NFT}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box p={2}>
                <ChainSelect />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={8}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            variant='standard'
            TabIndicatorProps={{
              style: { display: 'none' },
            }}
            aria-label='wallet tabs'>
            <CustomTab value={Tabs.MostWinner} label={Tabs.MostWinner} />
            <CustomTab value={Tabs.MostJoined} label={Tabs.MostJoined} />
            <CustomTab value={Tabs.MostEarned} label={Tabs.MostEarned} />
            <CustomTab value={Tabs.MostProfit} label={Tabs.MostProfit} />
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
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
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
                      onClick={(address) => { }}
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
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
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
                      onClick={(address) => { }}
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
                      label={`Earned  ${coinSymbol}:`}
                      joinsCount={Number(player.totalJoinedGames)}
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
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
                      onClick={(address) => { }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>{' '}
          </>
        )}
        {value === Tabs.MostProfit && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h6'>
                Ranking
              </Typography>
              <Grid container spacing={4}>
                {rankingMostProfitQuery.data?.players?.map((player, index) => (
                  <Grid item xs={12}>
                    <RankingButton
                      position={index + 1}
                      address={player.id}
                      featured={
                        player.id.toLowerCase() === account?.toLowerCase()
                      }
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
                      onClick={(address) => { }}
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
