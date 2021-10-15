import React, {useState, useCallback, useEffect} from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  Divider,
  CardContent,
  Card,
  Tooltip,
  LinearProgress,
  withStyles,
  Paper,
  CircularProgress,
  useTheme,
  Avatar,
  ButtonBase,
  Button,
  alpha,
  IconButton,
  Breadcrumbs,
  Link,
} from '@material-ui/core';
import {Alert, Skeleton} from '@material-ui/lab';
import {
  EditIcon,
  FastFoodOutlineIcon,
  FlashIcon,
  FlashOutlinedIcon,
  GiftIcon,
  ShareIcon,
  ShieldOutlinedIcon,
} from 'shared/components/Icons';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory, useParams} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {RewardDialog} from '../components/dialogs/RewardDialog';
import {useToggler} from 'hooks/useToggler';
import {useKittygotchi, useKittygotchiFeed, useKittygotchiV2} from '../hooks';
import {useMobile} from 'hooks/useMobile';
import FeedKittygotchiButton from '../components/buttons/FeedKittygotchiButton';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useWeb3} from 'hooks/useWeb3';

const useStyles = makeStyles((theme) => ({
  atkLinearColor: {
    backgroundColor: '#B892FF',
  },
  defLinearColor: {
    backgroundColor: '#7765E3',
  },
  runLinearColor: {
    backgroundColor: '#60A561',
  },
  circularProgress: {},
  avatar: {
    width: theme.spacing(40),
    height: theme.spacing(40),
    border: ' 1px solid #525C75',
    backgroundColor: '#2E3243',
  },
  relative: {
    position: 'relative',
  },
  collectRewardButton: {
    display: 'block',
    width: '100%',
  },
  collectRewardButtonIconSquare: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: alpha(theme.palette.common.white, 0.12),
    borderStyle: 'solid',
  },
  iconOutlinedWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[700],
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

interface Params {
  id: string;
}

export const KittyDetail = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState<string>();
  const params = useParams<Params>();

  const {chainId} = useWeb3();

  const rewardToggler = useToggler(false);

  const kittygotchi = useKittygotchiV2();

  const isMobile = useMobile();

  const history = useHistory();

  const {createNotification} = useNotifications();

  const handleClickEdit = useCallback(() => {
    history.push(`/kittygotchi/${params.id}/edit`);
  }, [history, params]);

  const {onFeedCallback} = useKittygotchiFeed();

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const handleFeed = useCallback(() => {
    const onSubmit = (hash?: string) => {
      if (hash && chainId) {
        createNotification({
          title: 'Feeding Kittygotchi',
          body: `Feeding Kittygotchi #${params.id}`,
          timestamp: Date.now(),
          url: getTransactionScannerUrl(chainId, hash),
          urlCaption: 'View transaction',
          type: NotificationType.TRANSACTION,
          metadata: {
            chainId: chainId,
            transactionHash: hash,
            status: 'pending',
          } as TxNotificationMetadata,
        });
      }
    };

    const onConfirmation = (hash?: string) => {
      kittygotchi.get(params.id);
    };

    const onError = (error?: any) => {
      if (error.data) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage(error.message);
      }
    };

    onFeedCallback(params.id, {
      onConfirmation,
      onError,
      onSubmit,
    });
  }, [onFeedCallback, params.id, createNotification, chainId]);

  useEffect(() => {
    if (params.id) {
      kittygotchi.get(params.id);
    }
  }, [params.id]);

  return (
    <>
      <RewardDialog
        dialogProps={{
          open: rewardToggler.show,
          onClose: rewardToggler.toggle,
        }}
      />
      <Box>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to='/'>
                  <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                </Link>
                <Link color='inherit' component={RouterLink} to='/kittygotchi'>
                  Kittygotchi
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='centerw'
                  mr={2}>
                  <IconButton
                    size='small'
                    component={RouterLink}
                    to={'/kittygotchi'}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography variant='h5'>
                  {kittygotchi.isLoading ? (
                    <Skeleton width={theme.spacing(24)} />
                  ) : (
                    <>Kittygotchi #{kittygotchi.data?.id}</>
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleClearError}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <Paper>
                      <Box p={4}>
                        <Box
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          mb={2}>
                          {kittygotchi.isLoading ? (
                            <Skeleton
                              variant='circle'
                              className={classes.avatar}
                            />
                          ) : (
                            <Avatar
                              className={classes.avatar}
                              src={kittygotchi?.data?.image}
                            />
                          )}
                        </Box>
                        <Grid
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          container
                          spacing={2}>
                          <Grid item>
                            <Tooltip title='Feed'>
                              <FeedKittygotchiButton onClick={handleFeed} />
                            </Tooltip>
                          </Grid>
                          {/*<Grid item>
                            <Tooltip title='Edit (Coming soon)'>
                              <RoundedIconButton
                                disabled
                                onClick={handleClickEdit}>
                                <EditIcon />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>*/}
                          <Grid item>
                            <Tooltip title='Share'>
                              <RoundedIconButton>
                                <ShareIcon />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Paper>
                      <Box p={4}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box mb={isMobile ? 4 : 0}>
                              <Typography
                                align={isMobile ? 'center' : 'left'}
                                variant='h5'>
                                Kittygotchi #{kittygotchi.data?.id}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            {isMobile ? (
                              <Box>
                                <Box
                                  mb={2}
                                  display='flex'
                                  alignItems='center'
                                  alignContent='center'
                                  justifyContent='space-between'>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box className={classes.iconWrapper} mr={1}>
                                      <FlashOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      <strong>Attack</strong>
                                    </Typography>
                                  </Box>
                                  <Typography variant='body1'>
                                    {kittygotchi.data?.attack}
                                  </Typography>
                                </Box>
                                <Box
                                  mb={2}
                                  display='flex'
                                  alignItems='center'
                                  alignContent='center'
                                  justifyContent='space-between'>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box className={classes.iconWrapper} mr={1}>
                                      <ShieldOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      <strong>Defense</strong>
                                    </Typography>
                                  </Box>
                                  <Typography variant='body1'>
                                    {kittygotchi.data?.defense}
                                  </Typography>
                                </Box>
                                <Box
                                  mb={2}
                                  display='flex'
                                  alignItems='center'
                                  alignContent='center'
                                  justifyContent='space-between'>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box className={classes.iconWrapper} mr={1}>
                                      <FlashOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      <strong>Run</strong>
                                    </Typography>
                                  </Box>
                                  <Typography variant='body1'>
                                    {kittygotchi.data?.run}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Grid container spacing={2}>
                                <Grid item>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box
                                      className={classes.iconOutlinedWrapper}
                                      mr={2}>
                                      <FlashOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      {kittygotchi.data?.attack}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box
                                      className={classes.iconOutlinedWrapper}
                                      mr={2}>
                                      <ShieldOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      {kittygotchi.data?.defense}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    alignContent='center'>
                                    <Box
                                      className={classes.iconOutlinedWrapper}
                                      mr={2}>
                                      <FlashOutlinedIcon
                                        className={classes.icon}
                                      />
                                    </Box>
                                    <Typography variant='body1'>
                                      {kittygotchi.data?.run}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyDetail;
