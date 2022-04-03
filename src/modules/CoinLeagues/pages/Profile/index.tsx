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
  Chip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import {Link as RouterLink} from 'react-router-dom';

import {Skeleton} from '@material-ui/lab';

import {ProfileImage} from 'modules/CoinLeagues/components/Profile/ProfileImage';
import React, {useState, useCallback, useEffect} from 'react';
import MainLayout from 'shared/components/layouts/main';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import {Edit, Share} from '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ProfileStatsPill from 'modules/CoinLeagues/components/Profile/ProfileStatsPill';
import {
  CupStatsIcon,
  DiscoverStatsIcon,
} from 'modules/CoinLeagues/components/Profile/icons';

// import {CoinStack} from 'modules/CoinLeagues/components/Profile/CoinStack';
import {useHistory, useParams} from 'react-router';
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
import {
  coinLeagueGamesToSlug,
  reduceAddress,
  slugToCoinLeagueGame,
} from 'modules/CoinLeagues/utils/game';
import MyGamesTable from 'modules/CoinLeagues/components/MyGamesTable';
import CopyButton from 'shared/components/CopyButton';
import {useWeb3} from 'hooks/useWeb3';
import {useProfileGame} from 'modules/CoinLeagues/hooks/useGameProfile';
import {getNormalizedUrl} from 'utils/browser';
import {useChampionBalance} from 'modules/CoinLeagues/hooks/champions';
import {chainIdToSlug, slugToChainId} from 'utils/nft';
import {ChainId} from 'types/blockchain';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {COINLEAGUE_PROFILE_ROUTE} from 'shared/constants/routes';
import NFTLeagueGamesTable from 'modules/NFTLeague/components/NFTLeagueGamesTable';
import SquidLeagueMyGamesTable from 'modules/SquidLeague/components/MyGamesTable';

import {GameStatus as NFTLeagueGameStatus} from 'modules/NFTLeague/constants/enum';

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
    display: 'flex',
  },
  nftButtonImage: {
    marginBottom: -theme.spacing(5),
  },
  innerPaper: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

export const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);

  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();

  const {account} = useWeb3();

  const {coinSymbol, chainId} = useLeaguesChainInfo();

  const {address} = useParams<{address: string}>();

  const gameProfile = useProfileGame(address.trim().toLowerCase());

  const championsBalance = useChampionBalance({chainId, account: address});

  const {messages} = useIntl();

  const [nftLeagueStatus, setNftLeagueStatus] = useState<
    NFTLeagueGameStatus | undefined
  >();

  const [selectedGame, setSelectedGame] = useState<CoinLeagueGames>(
    CoinLeagueGames.CoinLeague,
  );

  const [network, setNetwork] = useState<ChainId>(ChainId.Matic);

  const handleSelectGame = useCallback(
    (e) => {
      setSelectedGame(e.target.value);
      history.replace(
        `${COINLEAGUE_PROFILE_ROUTE}/${address}?network=${chainIdToSlug(
          network,
        )}&game=${coinLeagueGamesToSlug(e.target.value)}`,
      );
    },
    [network, address, history],
  );

  const handleNetworkChange = useCallback(
    (e) => {
      setNetwork(e.target.value);
      history.replace(
        `${COINLEAGUE_PROFILE_ROUTE}/${address}?network=${chainIdToSlug(
          e.target.value as ChainId,
        )}&game=${coinLeagueGamesToSlug(selectedGame)}`,
      );
    },
    [history, address, selectedGame],
  );

  const isMobile = useMobile();

  const shareDialogToggler = useToggler();

  const handleCloseShareDialog = useCallback(() => {
    shareDialogToggler.set(false);
  }, [shareDialogToggler]);

  const handleGoCollection = useCallback(() => {
    history.push(`/coin-league/profile/${address}/my-champions`);
  }, [history, address]);

  useEffect(() => {
    const game = searchParams.get('game');
    const networkParam = searchParams.get('network');

    if (game !== null) {
      setSelectedGame(slugToCoinLeagueGame(game));
    }

    if (networkParam !== null) {
      setNetwork(slugToChainId(networkParam));
    }
    // eslint-disable-next-line
  }, []);

  const handleBack = useCallback(
    (ev: any) => {
      if (history.length > 0) {
        history.goBack();
      } else {
        history.push(listGamesRoute);
      }
      //history.push(listGamesRoute)
    },
    [listGamesRoute, history],
  );

  const playerStats = usePlayerProfileStats(
    address.trim().toLowerCase(),
    selectedGame === CoinLeagueGames.CoinLeagueNFT,
  );

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
        game={selectedGame}
        network={network ? network : chainId}
      />
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box display={'flex'} alignItems={'center'}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' style={{margin: 5}}>
                <IntlMessages id='app.coinLeagues.profile' />
              </Typography>
            </Box>
          </Grid>
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
                  <ProfileImage
                    image={
                      gameProfile.data?.profileImage
                        ? getNormalizedUrl(gameProfile.data?.profileImage)
                        : undefined
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={isMobile ? 12 : undefined} sm>
                <Typography
                  className={classes.fontBold}
                  align={isMobile ? 'center' : 'left'}
                  variant='body1'>
                  {gameProfile.data && !gameProfile.error
                    ? gameProfile.data.username
                    : isAddress(address)
                    ? reduceAddress(address)
                    : null}
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
              {/* {!isMobile ? (
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
              ) : null} */}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* {isMobile ? (
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
          ) : null} */}
          <Grid item xs={12}>
            <Grid
              container
              spacing={4}
              alignItems='center'
              alignContent='center'>
              {account?.toLowerCase() === address?.toLowerCase() ? (
                <Grid item xs={isMobile ? true : undefined}>
                  <Button
                    component={RouterLink}
                    to={`/coin-league/profile/${address}/edit`}
                    fullWidth
                    color='primary'
                    variant='contained'
                    startIcon={<Edit />}>
                    <IntlMessages id='app.coinLeague.edit' />
                  </Button>
                </Grid>
              ) : false ? (
                <Grid item xs={isMobile ? true : undefined}>
                  <Button
                    disabled
                    fullWidth
                    color='primary'
                    variant='contained'>
                    <IntlMessages id='app.coinLeague.follow' />
                  </Button>
                </Grid>
              ) : null}
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
            <Select
              value={network}
              onChange={handleNetworkChange}
              variant='outlined'
              fullWidth>
              <MenuItem value={ChainId.Matic}>Polygon</MenuItem>
              <MenuItem value={ChainId.Binance}>Binance Smart Chain</MenuItem>
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
              <MenuItem value={CoinLeagueGames.CoinLeagueNFT}>
                Coin League NFT
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

            {(selectedGame === CoinLeagueGames.CoinLeague ||
              selectedGame === CoinLeagueGames.CoinLeagueNFT) && (
              <Box className={classes.container}>
                <Grid
                  container
                  spacing={4}
                  wrap={isMobile ? 'nowrap' : undefined}>
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
          <Grid item xs={isMobile ? 12 : undefined}>
            <ButtonBase
              onClick={handleGoCollection}
              component={Paper}
              className={classes.seeCollectionCallToAction}>
              <Grid container spacing={4}>
                <Grid item>
                  <img
                    className={classes.nftButtonImage}
                    src={require('../../assets/profile-coin-nft.png')}
                    alt=''
                  />
                </Grid>
                <Grid item xs>
                  <Typography
                    className={classes.fontBold}
                    color='textPrimary'
                    variant='subtitle1'>
                    <IntlMessages id='app.coinLeague.myChampions' />
                  </Typography>
                  <Typography
                    gutterBottom
                    variant='body2'
                    color='textSecondary'>
                    Click here to see your champion collection
                  </Typography>
                  <Typography variant='h5'>
                    {championsBalance.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {' '}
                        {championsBalance.data}{' '}
                        <IntlMessages id='app.coinLeague.items' />
                      </>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </ButtonBase>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {selectedGame === CoinLeagueGames.NFTLeague && (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Grid container justifyContent='center'>
                    <Grid item>
                      <Grid
                        container
                        spacing={2}
                        justifyContent='center'
                        alignItems='center'
                        alignContent='center'>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            color={
                              nftLeagueStatus === undefined
                                ? 'primary'
                                : 'default'
                            }
                            label={<IntlMessages id='nftLeague.all' />}
                            onClick={() => setNftLeagueStatus(undefined)}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            color={
                              nftLeagueStatus === NFTLeagueGameStatus.Waiting
                                ? 'primary'
                                : 'default'
                            }
                            label={<IntlMessages id='nftLeague.waiting' />}
                            onClick={() =>
                              setNftLeagueStatus(NFTLeagueGameStatus.Waiting)
                            }
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            color={
                              nftLeagueStatus === NFTLeagueGameStatus.Started
                                ? 'primary'
                                : 'default'
                            }
                            label={<IntlMessages id='nftLeague.inProgress' />}
                            onClick={() =>
                              setNftLeagueStatus(NFTLeagueGameStatus.Started)
                            }
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            color={
                              nftLeagueStatus === NFTLeagueGameStatus.Aborted
                                ? 'primary'
                                : 'default'
                            }
                            onClick={() =>
                              setNftLeagueStatus(NFTLeagueGameStatus.Aborted)
                            }
                            label={<IntlMessages id='nftLeague.aborted' />}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            color={
                              nftLeagueStatus === NFTLeagueGameStatus.Ended
                                ? 'primary'
                                : 'default'
                            }
                            onClick={() =>
                              setNftLeagueStatus(NFTLeagueGameStatus.Ended)
                            }
                            label={<IntlMessages id='nftLeague.ended' />}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <NFTLeagueGamesTable filters={{status: nftLeagueStatus}} />
                </Grid>
              </Grid>
            )}
            {(selectedGame === CoinLeagueGames.CoinLeague ||
              selectedGame === CoinLeagueGames.CoinLeagueNFT) && (
              <MyGamesTable
                address={address}
                isNFT={selectedGame === CoinLeagueGames.CoinLeagueNFT}
              />
            )}
            {selectedGame === CoinLeagueGames.SquidGame && (
              <SquidLeagueMyGamesTable account={address} />
            )}
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
