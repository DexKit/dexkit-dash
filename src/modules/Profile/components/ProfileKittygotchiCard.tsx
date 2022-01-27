import React, {useCallback} from 'react';
import moment from 'moment';

import {ChainId} from 'types/blockchain';
import {Link as RouterLink} from 'react-router-dom';

import {ethers} from 'ethers';

import {
  Avatar,
  makeStyles,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  useTheme,
  Tooltip,
  Divider,
  CardHeader,
  Chip,
} from '@material-ui/core';

import {useIntl} from 'react-intl';

import {Alert} from '@material-ui/lab';

import {NFTEmptyStateImage, ShareIcon} from 'shared/components/Icons';

import GavelIcon from '@material-ui/icons/Gavel';
import {Kittygotchi} from 'types/kittygotchi';
import FeedKittygotchiButton from 'modules/Kittygotchi/components/buttons/FeedKittygotchiButton';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {useWeb3} from 'hooks/useWeb3';
import SendIcon from '@material-ui/icons/Send';

import {Skeleton} from '@material-ui/lab';
import {useMobile} from 'hooks/useMobile';
import {
  canFeedKitty,
  GET_KITTYGOTCHI_CHAIN_SYMBOL,
  GET_KITTYGOTCHI_MINT_RATE,
  isKittygotchiNetworkSupported,
  isKittyTired,
} from 'modules/Kittygotchi/utils';
import CountdownSpan from 'shared/components/CountdownSpan';
import {leftPad} from 'utils';

import EditIcon from '@material-ui/icons/Edit';
import IntlMessages from '@crema/utility/IntlMessages';
import {useChainInfo} from 'hooks/useChainInfo';

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: ' 1px solid #525C75',
    backgroundColor: '#2E3243',
    width: theme.spacing(28),
    height: theme.spacing(28),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(32),
      height: theme.spacing(32),
    },
  },
}));

interface ProfileKittygotchiCardProps {
  loading?: boolean;
  onMint?: () => void;
  onFeed?: () => void;
  onEdit?: () => void;
  kittygotchi?: Kittygotchi;
  loadingKyttie?: boolean;
  onTransfer: () => void;
  error?: any;
  onClearError: () => void;
}

export const ProfileKittygotchiCard = (props: ProfileKittygotchiCardProps) => {
  const {
    loading,
    error,
    onClearError,
    onMint,
    onFeed,
    kittygotchi,
    loadingKyttie,
    onEdit,
    onTransfer,
  } = props;

  const theme = useTheme();

  const {chainName} = useChainInfo();

  const classes = useStyles();

  const {chainId} = useWeb3();

  const isMobile = useMobile();

  const {messages} = useIntl();

  const goToOpenSea = useCallback(() => {
    if (kittygotchi) {
      window.open(
        `https://opensea.io/assets/matic/0xea88540adb1664999524d1a698cb84f6c922d2a1/${kittygotchi.id}`,
      );
    }
  }, [kittygotchi]);

  const renderEmpty = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {!isKittygotchiNetworkSupported(chainId) ? (
              <Grid item xs={12}>
                <Alert severity='info'>
                  <Typography variant='body2'>
                    <IntlMessages id='app.kittygotchi.connectYourWalletToSupportedNetwork' />
                  </Typography>
                </Alert>
              </Grid>
            ) : null}
            {isKittygotchiNetworkSupported(chainId) ? (
              <>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    justifyContent='center'>
                    <NFTEmptyStateImage />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom align='center' variant='h6'>
                    <IntlMessages id='app.kittygotchi.youDontHaveKittygotchi' />
                  </Typography>

                  <Typography
                    color='textSecondary'
                    align='center'
                    variant='body2'>
                    <IntlMessages id='app.kittygotchi.youWillNeddNTokensToCreateOne.1' />{' '}
                    <strong>
                      {ethers.utils.formatEther(
                        GET_KITTYGOTCHI_MINT_RATE(chainId),
                      )}{' '}
                      {GET_KITTYGOTCHI_CHAIN_SYMBOL(chainId)}
                    </strong>{' '}
                    <IntlMessages id='app.kittygotchi.youWillNeddNTokensToCreateOne.2' />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display='flex' justifyContent='center'>
                    <Button
                      onClick={onMint}
                      disabled={!isKittygotchiNetworkSupported(chainId)}
                      startIcon={<GavelIcon />}
                      variant='outlined'
                      color='primary'>
                      <IntlMessages id='app.kittygotchi.createKittygotchi' />
                    </Button>
                  </Box>
                </Grid>{' '}
              </>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderKittygotchi = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={isMobile ? 12 : undefined}>
          <Grid container spacing={2} direction='column'>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {loadingKyttie ? (
                  <Skeleton className={classes.avatar} variant='circle' />
                ) : (
                  <Avatar className={classes.avatar} src={kittygotchi?.image} />
                )}
              </Box>
            </Grid>

            <Grid item>
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                alignContent='center'
                spacing={2}>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(8)}
                      height={theme.spacing(8)}
                    />
                  ) : (
                    <Tooltip title='Feed'>
                      <FeedKittygotchiButton
                        disabled={!canFeedKitty(kittygotchi)}
                        onClick={onFeed}
                      />
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(8)}
                      height={theme.spacing(8)}
                    />
                  ) : (
                    <Tooltip title='Edit'>
                      <RoundedIconButton onClick={onEdit}>
                        <EditIcon />
                      </RoundedIconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(8)}
                      height={theme.spacing(8)}
                    />
                  ) : (
                    <Tooltip
                      title={messages['app.kittygotchi.transfer'] as string}>
                      <RoundedIconButton onClick={onTransfer}>
                        <SendIcon />
                      </RoundedIconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(8)}
                      height={theme.spacing(8)}
                    />
                  ) : (
                    <Tooltip
                      title={
                        chainId === ChainId.Binance
                          ? (messages[
                              'app.kittygotchi.openSeaIsNotSupported'
                            ] as string)
                          : (messages[
                              'app.kittygotchi.viewOnOpenSea'
                            ] as string)
                      }>
                      <RoundedIconButton
                        disabled={chainId === ChainId.Binance}
                        onClick={goToOpenSea}>
                        <ShareIcon />
                      </RoundedIconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={isMobile ? 12 : undefined}>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} />
        </Grid>
        <Grid item xs={isMobile ? 12 : true}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography align={isMobile ? 'center' : 'left'} variant='h4'>
                {loadingKyttie ? (
                  <Skeleton />
                ) : (
                  <>Kittygotchi #{kittygotchi?.id}</>
                )}
              </Typography>
            </Grid>
            {kittygotchi ? (
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent={isMobile ? 'center' : 'flex-start'}
                  alignItems='center'
                  alignContent='center'
                  spacing={4}>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      ATK
                    </Typography>
                    <Typography variant='h5'>
                      {leftPad(kittygotchi?.attack, 2)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      DEF
                    </Typography>
                    <Typography variant='h5'>
                      {leftPad(kittygotchi?.defense, 2)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      RUN
                    </Typography>
                    <Typography variant='h5'>
                      {leftPad(kittygotchi?.run, 2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              {isKittyTired(kittygotchi) ? (
                <Typography
                  align={isMobile ? 'center' : 'left'}
                  variant='body1'>
                  <IntlMessages id='app.kittygotchi.yourCatIsHungry' />:{' '}
                  <strong>
                    {moment.unix(kittygotchi?.lastUpdated || 0).fromNow()}
                  </strong>
                </Typography>
              ) : null}
              <Typography align={isMobile ? 'center' : 'left'} variant='body1'>
                {!canFeedKitty(kittygotchi) ? (
                  kittygotchi?.lastUpdated ? (
                    <>
                      <IntlMessages id='app.kittygotchi.youCanFeedYourKittygotchiIn' />{' '}
                      <strong>
                        <CountdownSpan
                          toDate={moment
                            .unix(kittygotchi?.lastUpdated)
                            .add(24, 'hours')}
                        />
                      </strong>
                    </>
                  ) : (
                    <Skeleton />
                  )
                ) : null}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderLoading = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <CircularProgress color='primary' size={theme.spacing(32)} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography align='center' variant='h6'>
            <IntlMessages id='app.kittygotchi.creatingYourKittygotchi' />
          </Typography>
          <Typography align='center' color='textSecondary' variant='body2'>
            <IntlMessages id='app.kittygotchi.pleaseSignTheTransaction' />
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Box mr={2}>
                <Typography variant='h5'>
                  {messages['app.kittygotchi.myKittygotchi'] as string}
                </Typography>
              </Box>
              <Chip label={chainName} />
            </Box>
            <Button
              size='medium'
              color='primary'
              to='/kittygotchi'
              component={RouterLink}>
              <IntlMessages id='app.kittygotchi.viewMore' />
            </Button>
          </Box>
        }
      />
      <Divider />
      <Box p={4}>
        <Grid container spacing={4}>
          {error ? (
            <Grid item xs={12}>
              <Alert severity='error' onClose={onClearError}>
                {error}
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={12}></Grid>
        </Grid>
        {loading
          ? renderLoading()
          : kittygotchi || loadingKyttie
          ? renderKittygotchi()
          : renderEmpty()}
      </Box>
    </Paper>
  );
};
