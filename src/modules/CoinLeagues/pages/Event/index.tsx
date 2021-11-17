import React, {useCallback} from 'react';
import {
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Divider,
  Chip,
  useTheme,
} from '@material-ui/core';

import {ethers} from 'ethers';

import IntlMessages from '@crema/utility/IntlMessages';

import moment from 'moment';

import {Alert, Skeleton} from '@material-ui/lab';

import {useMobile} from 'hooks/useMobile';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import {Link as RouterLink} from 'react-router-dom';

import {
  getEventAccessDate,
  getEventEarlyAccessDate,
  getEventCurrentRound,
  GET_EARLY_ACCESS_BITT_AMOUNT,
  GET_EARLY_ACCESS_KIT_AMOUNT,
  GET_EVENT_HOLDING_AMOUNT,
  getMaxSupplyForRound,
} from 'modules/CoinLeagues/utils/champions';

import coinsLeagueBannerPath from 'assets/images/banners/coinleague.svg';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import ChampionCard from 'modules/CoinLeagues/components/champions/ChampionCard';
import EarlyAccessCountdownSection from 'modules/CoinLeagues/components/champions/EarlyAccessCountdownSection';
import MintChampionDialog from 'modules/CoinLeagues/components/champions/dialogs/MintChampionDialog';
import {useToggler} from 'hooks/useToggler';
import {
  useChampionMint,
  useChampionsTotalSupply,
  useChampionTokenHolding,
  useMyChampions,
} from 'modules/CoinLeagues/hooks/champions';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import {leftPad} from 'utils';
import {
  EARLY_ACCESS_BITT_AMOUNT,
  EARLY_ACCESS_KIT_AMOUNT,
} from 'modules/CoinLeagues/constants';
import {MintChampionButton} from 'modules/CoinLeagues/components/champions/buttons/MintChampionButton';
import {getEventHoldingAmount} from '../../utils/champions';
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

  const {chainId, account, ethBalance} = useWeb3();

  const myChampions = useMyChampions(chainId, 4);

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

  const hasEnoughMatic = useCallback(() => {
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

  const isOnMaticChain = useCallback(() => {
    if (chainId === ChainId.Matic || chainId === ChainId.Mumbai) {
      return true;
    }

    return false;
  }, [chainId]);

  const handleCanMint = useCallback(() => {
    return isOnMaticChain() && canMintChampion() && hasEnoughMatic();
  }, [isOnMaticChain, canMintChampion, hasEnoughMatic]);

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
              {!isOnMaticChain() ? (
                <Grid item xs={12}>
                  <Alert severity='info'>
                    <Typography variant='body2'>
                      Connect to <strong>Polygon(MATIC)</strong> network to
                      create a champion.
                    </Typography>
                  </Alert>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Paper>
                  <Box p={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={isMobile ? 12 : true}>
                        <Grid container spacing={4} alignItems='stretch'>
                          <Grid item xs={12}>
                            <Grid justifyContent='center' container spacing={4}>
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
                                    {GET_EARLY_ACCESS_BITT_AMOUNT(chainId)} BITT
                                  </strong>{' '}
                                  tokens to unlock Coin League Champion early
                                  access.
                                </Typography>
                              </Grid>
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
                                                          theme.palette.success
                                                            .main,
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
                                                          theme.palette.success
                                                            .main,
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
                              Round {getEventCurrentRound() + 1}
                            </Typography>
                            <Typography variant='body1'>
                              In this round, users will be able to create{' '}
                              {getMaxSupplyForRound(getEventCurrentRound()) -
                                1000}{' '}
                              champions.
                            </Typography>
                          </Grid>
                          {isOnMaticChain() ? (
                            <Grid item xs={12}>
                              <Alert severity='info'>
                                There are only{' '}
                                <strong>
                                  {getMaxSupplyForRound(
                                    getEventCurrentRound(),
                                  ) - totalSupply}
                                </strong>{' '}
                                champions left to be created.
                              </Alert>
                            </Grid>
                          ) : null}
                          {!hasEnoughMatic() && isOnMaticChain() ? (
                            <Grid item xs={12}>
                              <Alert severity='warning'>
                                <IntlMessages id='app.coinLeague.notEnoughMaticStart' />{' '}
                                {GET_EVENT_HOLDING_AMOUNT(chainId)}{' '}
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
                  {myChampions.loading ? (
                    new Array(8).fill(null).map((item, index) => (
                      <Grid key={index} item xs={12} sm={3}>
                        <ChampionCard loading />
                      </Grid>
                    ))
                  ) : (
                    <>
                      {myChampions.data?.length === 0 || !isOnMaticChain() ? (
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
                                    No Champions yet
                                  </Typography>
                                  <Typography
                                    color='textSecondary'
                                    align='center'
                                    variant='body1'>
                                    Create one to see it here
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ChampionsEvent;
