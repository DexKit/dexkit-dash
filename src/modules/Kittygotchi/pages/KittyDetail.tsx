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
import {Skeleton} from '@material-ui/lab';
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
import {useKittygotchi} from '../hooks';
import {useMobile} from 'hooks/useMobile';

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

  const params = useParams<Params>();

  const rewardToggler = useToggler(false);

  const kittygotchi = useKittygotchi(params.id);

  const isMobile = useMobile();

  const history = useHistory();

  const handleClickEdit = useCallback(() => {
    history.push(`/kittygotchi/${params.id}/edit`);
  }, [history, params]);

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
                          <Avatar className={classes.avatar} />
                        </Box>
                        <Grid
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          container
                          spacing={2}>
                          <Grid item>
                            <Tooltip title='Feed'>
                              <RoundedIconButton>
                                <FastFoodOutlineIcon stroke='white' />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip title='Edit'>
                              <RoundedIconButton onClick={handleClickEdit}>
                                <EditIcon />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
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
