import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Divider,
  useTheme,
} from '@material-ui/core';

import {ethers} from 'ethers';

import moment from 'moment';

import {Alert, Skeleton} from '@material-ui/lab';

import {useMobile} from 'hooks/useMobile';

import {NFTEmptyStateImage, WalletEmptyImage} from 'shared/components/Icons';

import {Link as RouterLink} from 'react-router-dom';

import {
  getEventAccessDate,
  getEventEarlyAccessDate,
  getEventCurrentRound,
  GET_EARLY_ACCESS_BITT_AMOUNT,
  GET_EARLY_ACCESS_KIT_AMOUNT,
  GET_EVENT_HOLDING_AMOUNT,
  getMaxSupplyForRound,
  IS_CHAMPIONS_NETWORK_ENABLED,
} from 'modules/CoinLeague/utils/champions';

import coinsLeagueBannerPath from 'assets/images/banners/coinleague.svg';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {IS_CHAMPIONS_SUPPORTED_NETWORK} from 'modules/CoinLeague/utils/champions';

import ChampionCard from 'modules/CoinLeague/components/champions/ChampionCard';
import EarlyAccessCountdownSection from 'modules/CoinLeague/components/champions/EarlyAccessCountdownSection';
import MintChampionDialog from 'modules/CoinLeague/components/champions/dialogs/MintChampionDialog';
import {useToggler} from 'hooks/useToggler';
import {
  useChampionMint,
  useChampionsTotalSupply,
  useChampionTokenHolding,
  useMyChampions,
} from 'modules/CoinLeague/hooks/champions';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import {leftPad} from 'utils';
import {
  EARLY_ACCESS_BITT_AMOUNT,
  EARLY_ACCESS_KIT_AMOUNT,
} from 'modules/CoinLeague/constants';
import {MintChampionButton} from 'modules/CoinLeague/components/champions/buttons/MintChampionButton';
import {getEventHoldingAmount} from '../../utils/champions';

import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {switchChain} from 'utils/wallet';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';

const useStyles = makeStyles((theme) => ({
  bannerBox: {
    borderRadius: theme.shape.borderRadius,
  },
  banner: {
    borderRadius: theme.shape.borderRadius,
  },
  coinsLogo: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  coinsLogoWrapper: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: '50%',
  },
}));

export function ChampionsEvent() {
  const classes = useStyles();

  const theme = useTheme();

  const isMobile = useMobile();

  const {
    account,
    ethBalance,
    onConnectWeb3,
    getProvider,
    chainId: web3ChainId,
  } = useWeb3();
  const {chainId, coinSymbol} = useLeaguesChainInfo();

  const myChampions = useMyChampions({chainId, limit: 4});

  const championTokenHolding = useChampionTokenHolding(account);

  const mintDialogToggler = useToggler(false);

  const {totalSupply} = useChampionsTotalSupply(chainId);

  const championMint = useChampionMint();

  const handleMintChampion = useCallback(() => {
    mintDialogToggler.set(true);
  }, [mintDialogToggler]);

  /* eslint-disable */
  const handleConfirmMint = useCallback(async () => {
    await championMint.mint();
  }, [championMint.mint]);

  const handleCloseMintDialog = useCallback(() => {
    mintDialogToggler.set(false);
    championMint.clear();
    myChampions.fetch();
  }, [mintDialogToggler, championMint.clear]);

  const handleConnect = useCallback(() => {
    onConnectWeb3((account: any) => {});
  }, [onConnectWeb3]);

  const hasEnoughKit = useCallback(() => {
    if (championTokenHolding.data && chainId) {
      return (
        championTokenHolding.data?.kit >=
        EARLY_ACCESS_KIT_AMOUNT[chainId as ChainId]
      );
    }

    return false;
  }, [championTokenHolding, chainId]);

  const hasEnoughBitt = useCallback(() => {
    if (championTokenHolding.data && chainId) {
      return (
        championTokenHolding.data?.bitt >=
        EARLY_ACCESS_BITT_AMOUNT[chainId as ChainId]
      );
    }

    return false;
  }, [championTokenHolding, chainId]);

  const hasEnoughAmount = useCallback(() => {
    let amount = getEventHoldingAmount(chainId);

    if (amount) {
      let balance = ethers.utils.parseUnits(ethBalance.toString(), 18);
      return balance.gte(amount);
    }

    return false;
  }, [chainId, ethBalance]);

  const isElegibleForEarlyAccess = useCallback(() => {
    return hasEnoughKit() || hasEnoughBitt();
  }, [hasEnoughKit, hasEnoughBitt]);

  const canMintChampion = useCallback(() => {
    let date = moment.unix(
      getEventAccessDate(getEventCurrentRound(), 1, chainId),
    );

    if (isElegibleForEarlyAccess()) {
      date = moment.unix(
        getEventEarlyAccessDate(getEventCurrentRound(), 1, chainId),
      );
    }

    return moment.utc().isAfter(date);
  }, [isElegibleForEarlyAccess, chainId]);

  const handleCanMint = useCallback(() => {
    return (
      IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) &&
      canMintChampion() &&
      hasEnoughAmount()
    );
  }, [chainId, canMintChampion, hasEnoughAmount]);

  const {onSwitchMagicNetwork} = useMagicProvider();

  const handleSwitchToMatic = useCallback(() => {
    if (isMagicProvider()) {
      const network = GET_MAGIC_NETWORK_FROM_CHAIN_ID(chainId as ChainId);
      onSwitchMagicNetwork(network);
    } else {
      switchChain(getProvider(), ChainId.Matic);
    }
  }, [getProvider]);

  return (
    <>
      <MintChampionDialog
        dialogProps={{
          open: mintDialogToggler.show,
          onClose: handleCloseMintDialog,
        }}
        onConfirm={handleConfirmMint}
        loading={championMint.loading}
        error={championMint.error}
        tokenId={championMint.tokenId}
        onTryAgain={handleConfirmMint}
        transactionHash={championMint.transactionHash}
      />
      <Box>
        <Grid container spacing={4} justifyContent='center'>
          <Grid item xs={12} sm={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'
                  className={classes.bannerBox}
                  boxShadow={3}>
                  <img
                    alt=''
                    className={classes.banner}
                    src={coinsLeagueBannerPath}
                  />
                </Box>
              </Grid>
              {!IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) ? (
                <Grid item xs={12}>
                  <Alert severity='info'>
                    <Typography variant='body2'>
                      <IntlMessages id='app.coinLeague.connectToPolygonOrBscNetwork' />
                    </Typography>
                  </Alert>
                </Grid>
              ) : null}
              {IS_CHAMPIONS_NETWORK_ENABLED(web3ChainId) ? (
                <Grid item xs={12}>
                  <Paper>
                    <Box p={4}>
                      <Grid container spacing={4}>
                        <Grid item xs={isMobile ? 12 : true}>
                          <Grid container spacing={4} alignItems='stretch'>
                            <Grid item xs={12}>
                              <Grid
                                justifyContent='center'
                                container
                                spacing={4}>
                                <Grid item xs={12}>
                                  <EarlyAccessCountdownSection
                                    elegible={isElegibleForEarlyAccess()}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant='h6'>
                                    How to Unlock Early Access
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography
                                    color='textSecondary'
                                    variant='body2'>
                                    You will need{' '}
                                    <strong>
                                      {GET_EARLY_ACCESS_KIT_AMOUNT(chainId)} KIT
                                    </strong>{' '}
                                    or{' '}
                                    <strong>
                                      {GET_EARLY_ACCESS_BITT_AMOUNT(chainId)}{' '}
                                      BITT
                                    </strong>{' '}
                                    tokens to unlock Coin League Champion early
                                    access.
                                  </Typography>
                                </Grid>
                                {IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) ? (
                                  <Grid item xs={12}>
                                    <Box py={{xs: 0, sm: 4}}>
                                      <Grid
                                        container
                                        spacing={8}
                                        justifyContent='center'
                                        alignItems='center'
                                        alignContent='center'>
                                        <Grid item>
                                          <Box>
                                            {championTokenHolding.isLoading ? (
                                              <Skeleton />
                                            ) : (
                                              <>
                                                <Grid
                                                  container
                                                  spacing={2}
                                                  justifyContent='center'
                                                  alignItems='center'
                                                  alignContent='center'>
                                                  <Grid item>
                                                    <Box
                                                      className={
                                                        classes.coinsLogoWrapper
                                                      }>
                                                      <img
                                                        alt=''
                                                        className={
                                                          classes.coinsLogo
                                                        }
                                                        src={require('assets/images/dexkit-logo-icon.svg')}
                                                      />
                                                    </Box>
                                                  </Grid>
                                                  <Grid item>
                                                    <Typography variant='h4'>
                                                      {championTokenHolding.data
                                                        ? leftPad(
                                                            championTokenHolding
                                                              .data?.kit,
                                                            2,
                                                          )
                                                        : leftPad(0, 2)}{' '}
                                                    </Typography>
                                                  </Grid>
                                                  <Grid item>
                                                    {hasEnoughKit() ? (
                                                      <Typography variant='h4'>
                                                        <CheckCircleOutlineIcon
                                                          style={{
                                                            color:
                                                              theme.palette
                                                                .success.main,
                                                          }}
                                                        />
                                                      </Typography>
                                                    ) : (
                                                      <Typography variant='h4'>
                                                        <HighlightOffIcon color='error' />
                                                      </Typography>
                                                    )}
                                                  </Grid>
                                                </Grid>
                                              </>
                                            )}
                                          </Box>
                                        </Grid>
                                        <Grid item>
                                          <Box>
                                            {championTokenHolding.isLoading ? (
                                              <Skeleton />
                                            ) : (
                                              <>
                                                <Grid
                                                  container
                                                  spacing={2}
                                                  justifyContent='center'
                                                  alignItems='center'
                                                  alignContent='center'>
                                                  <Grid item>
                                                    <Box
                                                      className={
                                                        classes.coinsLogoWrapper
                                                      }>
                                                      <img
                                                        alt=''
                                                        className={
                                                          classes.coinsLogo
                                                        }
                                                        src={require('assets/images/logos/bittoken-logo.png')}
                                                      />
                                                    </Box>
                                                  </Grid>
                                                  <Grid item>
                                                    <Typography variant='h4'>
                                                      {championTokenHolding.data
                                                        ? leftPad(
                                                            championTokenHolding
                                                              .data?.bitt,
                                                            2,
                                                          )
                                                        : leftPad(0, 2)}{' '}
                                                    </Typography>
                                                  </Grid>
                                                  <Grid item>
                                                    {hasEnoughBitt() ? (
                                                      <Typography variant='h4'>
                                                        <CheckCircleOutlineIcon
                                                          style={{
                                                            color:
                                                              theme.palette
                                                                .success.main,
                                                          }}
                                                        />
                                                      </Typography>
                                                    ) : (
                                                      <Typography variant='h4'>
                                                        <HighlightOffIcon color='error' />
                                                      </Typography>
                                                    )}
                                                  </Grid>
                                                </Grid>
                                              </>
                                            )}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : undefined}>
                          <Divider
                            orientation={isMobile ? 'horizontal' : 'vertical'}
                          />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : true}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
                              <Typography gutterBottom variant='h5'>
                                <IntlMessages id='app.coinLeague.round' />{' '}
                                {getEventCurrentRound() + 1}
                              </Typography>
                              <Typography variant='body1'>
                                <IntlMessages id='app.coinLeague.inThisRoundUsersWill' />{' '}
                                {getMaxSupplyForRound(getEventCurrentRound()) -
                                  1000}{' '}
                                <IntlMessages id='app.coinLeague.champions' />
                              </Typography>
                            </Grid>
                            {IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) ? (
                              <Grid item xs={12}>
                                <Alert severity='info'>
                                  <IntlMessages id='app.coinLeague.thereAreOnly' />{' '}
                                  <strong>
                                    {getMaxSupplyForRound(
                                      getEventCurrentRound(),
                                    ) - totalSupply}
                                  </strong>{' '}
                                  <IntlMessages id='app.coinLeague.championsLeftToBeCreated' />
                                </Alert>
                              </Grid>
                            ) : null}
                            {!hasEnoughAmount() &&
                            IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) ? (
                              <Grid item xs={12}>
                                <Alert severity='warning'>
                                  <IntlMessages id='app.coinLeague.notEnoughMaticStart' />{' '}
                                  {GET_EVENT_HOLDING_AMOUNT(chainId)}{' '}
                                  {coinSymbol}{' '}
                                  <IntlMessages id='app.coinLeague.notEnoughMaticEnd' />
                                </Alert>
                              </Grid>
                            ) : null}
                            <Grid item xs={12}>
                              <MintChampionButton
                                soldOut={
                                  totalSupply ===
                                  getMaxSupplyForRound(getEventCurrentRound())
                                }
                                onMintChampion={handleMintChampion}
                                canMintChampion={handleCanMint}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              ) : (
                <>
                  {chainId === ChainId.Binance && (
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Paper>
                          <Box p={4}>
                            <Grid
                              container
                              direction='column'
                              alignItems='center'
                              alignContent='center'
                              justifyContent='center'
                              spacing={4}>
                              <Grid item>
                                <Typography
                                  align='center'
                                  gutterBottom
                                  variant='h5'>
                                  <IntlMessages id='app.coinLeague.comingSoon' />
                                </Typography>
                                <Typography
                                  align='center'
                                  color='textSecondary'
                                  variant='body1'>
                                  <IntlMessages id='app.coinLeague.coinLeagueChampionsAreComingSoonToBSC' />
                                </Typography>
                              </Grid>

                              <Grid item>
                                <Button
                                  color='primary'
                                  variant='contained'
                                  onClick={handleSwitchToMatic}>
                                  <IntlMessages id='app.coinLeague.switchToMaticNetwork' />
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                  {chainId === ChainId.Matic && (
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Paper>
                          <Box p={4}>
                            <Grid
                              container
                              direction='column'
                              alignItems='center'
                              alignContent='center'
                              justifyContent='center'
                              spacing={4}>
                              <Grid item>
                                <Typography
                                  align='center'
                                  gutterBottom
                                  variant='h5'>
                                  <IntlMessages
                                    id='app.coinLeague.mintingHalted'
                                    defaultMessage={'Minting Halted'}
                                  />
                                </Typography>
                                <Typography
                                  align='center'
                                  color='textSecondary'
                                  variant='body1'>
                                  <IntlMessages
                                    id='app.coinLeague.coinLeagueChampionsMintingHalted'
                                    defaultMessage={
                                      'Minting Halted on Polygon Network, you can get a champion on secondary market'
                                    }
                                  />
                                </Typography>
                              </Grid>

                              <Grid item>
                                <Button
                                  href='https://opensea.io/collection/coinleaguechampions'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  variant='outlined'
                                  color='primary'>
                                  <IntlMessages
                                    id='app.coinLeague.buyOnOpenSea'
                                    defaultMessage={'Buy Champion on OpenSea'}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
              {IS_CHAMPIONS_NETWORK_ENABLED(web3ChainId) ? (
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Box
                        display='flex'
                        alignItems='center'
                        alignContent='center'
                        justifyContent='space-between'>
                        <Typography variant='h6'>
                          <IntlMessages id='app.coinLeague.myChampions' />
                        </Typography>
                        <Button
                          component={RouterLink}
                          to='/champions'
                          disabled={myChampions.data?.length === 0}
                          color='primary'>
                          <IntlMessages id='app.coinLeague.viewMore' />
                        </Button>
                      </Box>
                    </Grid>
                    {account ? (
                      <>
                        {myChampions.loading ? (
                          new Array(8).fill(null).map((item, index) => (
                            <Grid key={index} item xs={12} sm={3}>
                              <ChampionCard loading />
                            </Grid>
                          ))
                        ) : (
                          <>
                            {myChampions.data?.length === 0 ||
                            !IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) ? (
                              <Grid item xs={12}>
                                <Paper>
                                  <Box p={4}>
                                    <Grid
                                      direction='column'
                                      alignItems='center'
                                      alignContent='center'
                                      justifyContent='center'
                                      container
                                      spacing={4}>
                                      <Grid item>
                                        <NFTEmptyStateImage />
                                      </Grid>
                                      <Grid item>
                                        <Typography align='center' variant='h5'>
                                          <IntlMessages id='app.coinLeague.noChampionsYet' />
                                        </Typography>
                                        <Typography
                                          color='textSecondary'
                                          align='center'
                                          variant='body1'>
                                          <IntlMessages id='app.coinLeague.createOneToSeeItHere' />
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Paper>
                              </Grid>
                            ) : (
                              <>
                                {myChampions.data?.map((champion, index) => (
                                  <Grid key={index} item xs={12} sm={3}>
                                    <ChampionCard champion={champion} />
                                  </Grid>
                                ))}
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <Paper>
                          <Box p={4}>
                            <Grid
                              container
                              spacing={4}
                              alignItems='center'
                              alignContent='center'
                              justifyContent='center'
                              direction='column'>
                              <Grid item>
                                <WalletEmptyImage />
                              </Grid>
                              <Grid item>
                                <Typography align='center' variant='h5'>
                                  Connect wallet
                                </Typography>

                                <Typography align='center' variant='body1'>
                                  Connect your wallet to Polygon(MATIC) network
                                  to see your champions.
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  onClick={handleConnect}
                                  variant='contained'
                                  color='primary'>
                                  Connect wallet
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ChampionsEvent;
