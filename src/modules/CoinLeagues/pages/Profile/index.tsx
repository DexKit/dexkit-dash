import {
  Box,
  Divider,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  makeStyles,
  ButtonBase,
  Paper,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import {Skeleton} from '@material-ui/lab';

import {ProfileImage} from 'modules/CoinLeagues/components/Profile/ProfileImage';
import React, {useState, useCallback} from 'react';
import MainLayout from 'shared/components/layouts/main';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import {Edit, Share} from '@material-ui/icons';

import ProfileStatsPill from 'modules/CoinLeagues/components/Profile/ProfileStatsPill';
import {
  CupStatsIcon,
  DiscoverStatsIcon,
} from 'modules/CoinLeagues/components/Profile/icons';

// import {CoinStack} from 'modules/CoinLeagues/components/Profile/CoinStack';
import {useParams} from 'react-router';
import {usePlayerProfileStats} from 'modules/CoinLeagues/hooks/usePlayerProfileStats';
import {truncateAddress} from 'utils';
import {isAddress} from 'web3-utils';

import {ethers} from 'ethers';
import {useIntl} from 'react-intl';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {CoinLeagueGames} from 'modules/CoinLeagues/utils/types';
import IntlMessages from '@crema/utility/IntlMessages';
import {useMobile} from 'hooks/useMobile';
import ProfileShareDialog from 'modules/CoinLeagues/components/Profile/ProfileShareDialog';
import {useToggler} from 'hooks/useToggler';
import {reduceAddress} from 'modules/CoinLeagues/utils/game';
import MyGamesTable from 'modules/CoinLeagues/components/MyGamesTable';
import CopyButton from 'shared/components/CopyButton';
import {useWeb3} from 'hooks/useWeb3';

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  fontBold: {
    fontWeight: 600,
  },
  seeCollectionCallToAction: {
    padding: theme.spacing(4),
  },
}));

export const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const {account} = useWeb3();

  const {coinSymbol} = useLeaguesChainInfo();

  const {address} = useParams<{address: string}>();

  const playerStats = usePlayerProfileStats(address.toLowerCase());

  const {messages} = useIntl();

  const [selectedGame, setSelectedGame] = useState<CoinLeagueGames>(
    CoinLeagueGames.CoinLeague,
  );

  const handleSelectGame = useCallback((e) => {
    setSelectedGame(e.target.value);
  }, []);

  const isMobile = useMobile();

  const shareDialogToggler = useToggler();

  const handleCloseShareDialog = useCallback(() => {
    shareDialogToggler.set(false);
  }, [shareDialogToggler]);

  return (
    <>
      <ProfileShareDialog
        dialogProps={{
          open: shareDialogToggler.show,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
          fullScreen: isMobile,
        }}
        address={isAddress(address) ? address : ''}
      />
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={4}
              alignItems='center'
              alignContent='center'>
              <Grid item xs={isMobile ? 12 : undefined}>
                <Box
                  display='flex'
                  alignContent='center'
                  alignItems='center'
                  justifyContent='center'>
                  <ProfileImage image='' />
                </Box>
              </Grid>
              <Grid item xs={isMobile ? 12 : undefined} sm>
                <Typography
                  className={classes.fontBold}
                  align={isMobile ? 'center' : 'left'}
                  variant='body1'>
                  {isAddress(address) ? reduceAddress(address) : null}
                </Typography>
                <Typography
                  color='textSecondary'
                  align={isMobile ? 'center' : 'left'}
                  variant='body2'>
                  {isAddress(address) ? (
                    <>
                      {truncateAddress(address)}
                      <CopyButton
                        tooltip={messages['app.coinLeague.copied'] as string}
                        copyText={address}
                        color='inherit'
                        size='small'>
                        <FileCopyIcon fontSize='inherit' />
                      </CopyButton>
                    </>
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              {!isMobile ? (
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography
                        className={classes.fontBold}
                        gutterBottom
                        align='center'
                        variant='body1'>
                        300
                      </Typography>
                      <Typography
                        color='textSecondary'
                        align='center'
                        variant='body2'>
                        Followers
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Divider orientation='vertical' />
                    </Grid>
                    <Grid item>
                      <Typography
                        className={classes.fontBold}
                        gutterBottom
                        align='center'
                        noWrap
                        variant='body1'>
                        300
                      </Typography>
                      <Typography
                        color='textSecondary'
                        align='center'
                        variant='body2'>
                        Game plays
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {isMobile ? (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Typography
                    className={classes.fontBold}
                    gutterBottom
                    align='center'
                    variant='body1'>
                    300
                  </Typography>
                  <Typography
                    color='textSecondary'
                    align='center'
                    variant='body2'>
                    Followers
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography
                    className={classes.fontBold}
                    gutterBottom
                    align='center'
                    variant='body1'>
                    300
                  </Typography>
                  <Typography
                    color='textSecondary'
                    align='center'
                    variant='body2'>
                    Game plays
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Grid
              container
              spacing={4}
              alignItems='center'
              alignContent='center'>
              <Grid item xs={isMobile ? true : undefined}>
                {account === address ? (
                  <Button
                    component={RouterLink}
                    to={`/coin-league/profile/${address}/edit`}
                    fullWidth
                    color='primary'
                    variant='contained'
                    startIcon={<Edit />}>
                    <IntlMessages id='app.coinLeague.edit' />
                  </Button>
                ) : (
                  <Button fullWidth color='primary' variant='contained'>
                    <IntlMessages id='app.coinLeague.follow' />
                  </Button>
                )}
              </Grid>
              <Grid item xs={isMobile ? true : undefined}>
                <Button
                  fullWidth
                  color='primary'
                  variant='outlined'
                  onClick={shareDialogToggler.handleToggle}
                  startIcon={<Share />}>
                  <IntlMessages id='app.coinLeague.share' />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='app.coinLeague.network' />
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              <IntlMessages id='app.coinLeague.selectANetworkToViewDataFrom' />
            </Typography>
            <Select variant='outlined' fullWidth value='1'>
              <MenuItem value='1'>Polygon</MenuItem>
              <MenuItem value='2'>Binance Smart Chain</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='app.coinLeague.game' />
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              <IntlMessages id='app.coinLeague.selectTheGameYouWantToView' />
            </Typography>
            <Select
              variant='outlined'
              fullWidth
              value={selectedGame}
              onChange={handleSelectGame}>
              <MenuItem value={CoinLeagueGames.CoinLeague}>
                Coin League
              </MenuItem>
              <MenuItem value={CoinLeagueGames.NFTLeague}>NFT League</MenuItem>
              <MenuItem value={CoinLeagueGames.SquidGame}>Squid Game</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              Profile statistics
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              Statistics may change depending on the network you selected above
            </Typography>

            {selectedGame === CoinLeagueGames.CoinLeague && (
              <Box className={classes.container}>
                <Grid container spacing={4} wrap='nowrap'>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={messages['app.coinLeague.wins'] as string}
                      value={playerStats.data?.stats?.totalWinnedGames}
                    />
                  </Grid>

                  <Grid item>
                    <ProfileStatsPill
                      icon={<DiscoverStatsIcon />}
                      caption={messages['app.coinLeague.joinedGames'] as string}
                      value={playerStats.data?.stats?.totalJoinedGames}
                    />
                  </Grid>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={
                        messages['app.coinLeague.winnedFirstPosition'] as string
                      }
                      value={playerStats.data?.stats?.totalFirstWinnedGames}
                    />
                  </Grid>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={
                        messages[
                          'app.coinLeague.winnedSecondPosition'
                        ] as string
                      }
                      value={playerStats.data?.stats?.totalSecondWinnedGames}
                    />
                  </Grid>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={
                        messages['app.coinLeague.winnedThridPosition'] as string
                      }
                      value={playerStats.data?.stats?.totalThirdWinnedGames}
                    />
                  </Grid>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={messages['app.coinLeague.totalEarned'] as string}
                      value={`${ethers.utils.formatEther(
                        playerStats.data?.stats?.totalEarned || '0',
                      )} ${coinSymbol}`}
                    />
                  </Grid>
                  <Grid item>
                    <ProfileStatsPill
                      icon={<CupStatsIcon />}
                      caption={messages['app.coinLeague.totalSpent'] as string}
                      value={`${ethers.utils.formatEther(
                        playerStats.data?.stats?.totalSpent || '0',
                      )} ${coinSymbol}`}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
          {/* <Grid item xs={12}>
          <Typography
            className={classes.fontBold}
            color='textPrimary'
            variant='subtitle1'>
            Most Chosen Coin
          </Typography>
          <Typography gutterBottom variant='body2' color='textSecondary'>
            Most chosen coins by <strong>B53287</strong> in the coinleague game.
          </Typography>
          <CoinStack coins={[{image: ''}, {image: ''}, {image: ''}]} />
        </Grid> */}
          <Grid item xs={12}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              My Champions
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              Click below to see your champion collection
            </Typography>

            <ButtonBase
              component={Paper}
              className={classes.seeCollectionCallToAction}>
              <Grid
                container
                alignContent='center'
                alignItems='center'
                spacing={4}>
                <Grid item></Grid>
                <Grid item>
                  <Typography variant='h4'>20</Typography>
                </Grid>
                <Grid item>
                  <Box display='flex' alignContent='center' alignItems='center'>
                    <NavigateNextIcon />
                  </Box>
                </Grid>
              </Grid>
            </ButtonBase>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <MyGamesTable address={address} />
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
