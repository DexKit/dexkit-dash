import React, {useCallback, useState} from 'react';
import {
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Divider,
  useTheme,
} from '@material-ui/core';

import moment from 'moment';

import {Alert, Skeleton} from '@material-ui/lab';

import {useMobile} from 'hooks/useMobile';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import {
  getEventAccessDate,
  getEventCurrentRound,
} from 'modules/CoinLeagues/utils/champions';

import coinsLeagueBannerPath from 'assets/images/banners/coinsleague.svg';

import AddIcon from '@material-ui/icons/Add';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import ChampionCard from 'modules/CoinLeagues/components/champions/ChampionCard';
import EarlyAccessCountdownSection from 'modules/CoinLeagues/components/champions/EarlyAccessCountdownSection';
import MintChampionDialog from 'modules/CoinLeagues/components/champions/dialogs/MintChampionDialog';
import {useToggler} from 'hooks/useToggler';
import {
  useChampionMint,
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

  const {chainId} = useWeb3();

  const myChampions = useMyChampions(chainId, 4);

  const championTokenHolding = useChampionTokenHolding();

  const mintDialogToggler = useToggler(false);

  const championMint = useChampionMint();

  const handleMintChampion = useCallback(() => {
    mintDialogToggler.set(true);
  }, []);

  const handleConfirmMint = useCallback(async () => {
    await championMint.mint();
  }, [championMint.mint]);

  const handleCloseMintDialog = useCallback(() => {
    mintDialogToggler.set(false);
    championMint.clear();
    myChampions.fetch();
  }, [championMint.clear]);

  const hasEnoughKit = useCallback(() => {
    if (championTokenHolding.data?.length === 2) {
      return (
        championTokenHolding.data[0].balance.toNumber() ===
        EARLY_ACCESS_KIT_AMOUNT
      );
    }

    return false;
  }, [championTokenHolding.data]);

  const hasEnoughBitt = useCallback(() => {
    if (championTokenHolding.data?.length === 2) {
      return (
        championTokenHolding.data[1].balance.toNumber() ===
        EARLY_ACCESS_BITT_AMOUNT
      );
    }

    return false;
  }, [championTokenHolding.data]);

  const isElegibleForEarlyAccess = useCallback(() => {
    return hasEnoughKit() && hasEnoughBitt();
  }, [hasEnoughKit, hasEnoughBitt]);

  const canMintChampion = useCallback(() => {
    let date = moment.unix(getEventAccessDate(getEventCurrentRound(), 1));

    if (isElegibleForEarlyAccess()) {
      date = date.subtract(12, 'hours');
    }

    return moment.utc().isAfter(date);
  }, [isElegibleForEarlyAccess]);

  const isOnMaticChain = useCallback(() => {
    if (chainId === ChainId.Matic || chainId === ChainId.Mumbai) {
      return true;
    }

    return false;
  }, [chainId]);

  const handleCanMint = useCallback(() => {
    return isOnMaticChain() && canMintChampion();
  }, [isOnMaticChain, canMintChampion]);

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
                  <img className={classes.banner} src={coinsLeagueBannerPath} />
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
                                  <strong>{EARLY_ACCESS_KIT_AMOUNT} KIT</strong>{' '}
                                  and{' '}
                                  <strong>
                                    {EARLY_ACCESS_BITT_AMOUNT} BITT
                                  </strong>{' '}
                                  tokens to unlock Coin Leagues Champion early
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
                                                    ?.length === 2
                                                    ? leftPad(
                                                        championTokenHolding.data[0].balance.toNumber(),
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
                                                    ?.length === 2
                                                    ? leftPad(
                                                        championTokenHolding.data[1].balance.toNumber(),
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
                              Round 1
                            </Typography>
                            <Typography variant='body1'>
                              In this round users will be able to create 4400
                              champions.
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <MintChampionButton
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
                      <Typography variant='h6'>My Champions</Typography>
                      <Button
                        disabled={myChampions.data?.length === 0}
                        color='primary'>
                        View more
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
                      {myChampions.data?.length === 0 ? (
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
