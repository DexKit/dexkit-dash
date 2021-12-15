import React, {useState, useCallback, useEffect, useMemo} from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  useTheme,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Fade,
} from '@material-ui/core';
import {getNormalizedUrl} from 'utils/browser';

import {Skeleton, Alert} from '@material-ui/lab';

import DoneIcon from '@material-ui/icons/Done';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useParams} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {useToggler} from 'hooks/useToggler';
import {
  useKitHolding,
  useKittygotchiStyleEdit,
  useKittygotchiUpdate,
  useKittygotchiV2,
} from '../hooks';

import {UpdateKittygotchiDialog} from '../components/dialogs/UpdateKittygotchiDialog';

import {SubmitState} from '../components/ButtonState';
import KittygotchiImage from '../components/images/KittygotchiImage';
import KittygotchiTraitSelector from '../components/KittygotchiTraitSelector';
import {
  KittygotchiTraits,
  KittygotchiTraitType,
  KITTYGOTCHI_EDIT_MIN_AMOUNT,
} from '../constants';
import {useIntl} from 'react-intl';
import {useMobile} from 'hooks/useMobile';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import {ethers} from 'ethers';
import {Edit} from '@material-ui/icons';
import KittygotchiTrait from '../components/KittygotchiTrait';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: 'auto',
  },
  imageSkeleton: {
    width: '100%',
    minHeight: theme.spacing(40),
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.spacing(60),
    },
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

interface Params {
  id: string;
}

export const KittyEdit = () => {
  const classes = useStyles();
  const theme = useTheme();

  const params = useParams<Params>();

  const updateToggler = useToggler();

  //TODO: fix this
  /* eslint-disable */
  const [hasChange, setHasChange] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>();

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);

  const kittygotchi = useKittygotchiV2();
  const {onUpdateKittyCallback} = useKittygotchiUpdate();

  const kittyStyles = useKittygotchiStyleEdit();

  const onUpdateGotchi = useCallback(
    (_ev: any) => {
      updateToggler.set(true);

      setSubmitState(SubmitState.WaitingWallet);
      const onSubmitTx = (hash?: string) => {
        setSubmitState(SubmitState.Submitted);
      };
      const onConfirmTx = (hash?: string) => {
        // Save here the current id minted
        setSubmitState(SubmitState.Confirmed);

        setIsEditing(false);
      };
      const onError = (error?: any) => {
        updateToggler.set(false);
        setSubmitState(SubmitState.Error);
        setErrorMessage(error.message);
        setTimeout(() => {
          setSubmitState(SubmitState.None);
        }, 3000);
      };

      onUpdateKittyCallback(params.id, kittyStyles.params, {
        onConfirmation: onConfirmTx,
        onError,
        onSubmit: onSubmitTx,
      });
    },
    [params.id, onUpdateKittyCallback, kittyStyles],
  );

  const {account, chainId} = useWeb3();
  const isMobile = useMobile();
  const kitHolding = useKitHolding(account);

  const kitAmount = useMemo(() => {
    if (kitHolding.data && kitHolding.data.length) {
      return Number(ethers.utils.formatEther(kitHolding.data[0].balance));
    }
    return 0;
  }, [kitHolding?.data]);

  const {messages} = useIntl();

  const isSubmitting = useCallback(() => {
    return (
      submitState === SubmitState.WaitingWallet ||
      submitState === SubmitState.Submitted
    );
  }, [submitState]);

  const isConfirmed = useCallback(() => {
    return submitState === SubmitState.Confirmed;
  }, [submitState]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (chainId && (chainId === ChainId.Matic || chainId === ChainId.Mumbai)) {
      kittygotchi.get(params.id).then((data: any) => {
        if (data) {
          kittyStyles.fromTraits(data.attributes);
        }
      });
    }
  }, [chainId, params.id]);

  return (
    <>
      <UpdateKittygotchiDialog
        dialogProps={{
          open: updateToggler.show,
          onClose: updateToggler.toggle,
        }}
        done={isConfirmed()}
        loading={isSubmitting()}
      />
      <Box>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to='/'>
                  <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                </Link>
                <Link color='inherit' component={RouterLink} to='/profile'>
                  Kittygotchi
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
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
                    <Skeleton width={theme.spacing(12)} />
                  ) : (
                    `Kittygotchi #${kittygotchi.data?.id}`
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container justifyContent='center' spacing={4}>
          {errorMessage ? (
            <Grid item xs={12} sm={10}>
              <Alert severity='error' onClose={handleClearError}>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
          {chainId !== ChainId.Matic && chainId !== ChainId.Mumbai ? (
            <Grid item xs={12} sm={10}>
              <Alert severity='info'>
                <Typography variant='body2'>
                  <IntlMessages id='app.kittygotchi.connectToPolgyonAlert' />
                </Typography>
              </Alert>
            </Grid>
          ) : null}
          {kitAmount < KITTYGOTCHI_EDIT_MIN_AMOUNT &&
          (chainId === ChainId.Matic || chainId === ChainId.Mumbai) ? (
            <Grid item xs={12} sm={10}>
              <Alert severity='info'>
                You need at least{' '}
                <strong>{KITTYGOTCHI_EDIT_MIN_AMOUNT} KIT</strong> to edit your
                kittygotchi
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={12} sm={10}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Paper>
                      <Box p={4}>
                        {kittygotchi.isLoading ? (
                          <Skeleton
                            variant='rect'
                            className={classes.imageSkeleton}
                          />
                        ) : kittyStyles.isEmpty() ? (
                          <img
                            alt='EMPTY'
                            className={classes.image}
                            src={getNormalizedUrl(
                              kittygotchi.data?.image || '',
                            )}
                          />
                        ) : (
                          <KittygotchiImage
                            images={kittyStyles.getImageArray()}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                  {!isMobile ? (
                    <Grid item xs={12}>
                      {isEditing ? (
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Button
                              disabled={isSubmitting() || !hasChange}
                              onClick={onUpdateGotchi}
                              fullWidth
                              startIcon={
                                isSubmitting() ? (
                                  <CircularProgress
                                    color='inherit'
                                    size={theme.spacing(7)}
                                  />
                                ) : (
                                  <DoneIcon />
                                )
                              }
                              variant='contained'
                              color='primary'>
                              <IntlMessages id='app.kittygotchi.save' />
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              onClick={handleCancelEdit}
                              variant='contained'
                              fullWidth>
                              <IntlMessages id='app.kittygotchi.cancel' />
                            </Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Button
                          disabled={kittygotchi.isLoading}
                          fullWidth
                          onClick={handleEdit}
                          variant='contained'
                          color='primary'
                          startIcon={<Edit />}>
                          <IntlMessages id='app.kittygotchi.edit' />
                        </Button>
                      )}
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={4}>
                  {/* <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      defaultExpanded
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitAmount
                          : 0
                      }
                      title={messages['app.kittygotchi.body'] as string}
                      traitType={KittygotchiTraitType.BODY}
                      items={KittygotchiTraits[KittygotchiTraitType.BODY]}
                      onSelect={kittyStyles.handleSelectBody}
                      value={kittyStyles?.body}
                    />
                  </Grid> */}
                  {chainId == ChainId.Matic || chainId === ChainId.Mumbai ? (
                    <Grid item xs={12}>
                      <Paper>
                        <Box p={4}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
                              <Typography
                                color='textSecondary'
                                variant='overline'>
                                KIT Balance
                              </Typography>

                              <Grid
                                container
                                spacing={2}
                                alignItems='center'
                                alignContent='center'>
                                <Grid item>
                                  <Box className={classes.coinsLogoWrapper}>
                                    <img
                                      alt=''
                                      className={classes.coinsLogo}
                                      src={require('assets/images/dexkit-logo-icon.svg')}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <Typography variant='h4'>
                                    {kitHolding.isLoading ? (
                                      <Skeleton />
                                    ) : (
                                      kitAmount
                                    )}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    <Paper>
                      <Box p={4}>
                        {kittygotchi.isLoading ? (
                          <>
                            <Typography gutterBottom variant='h6'>
                              <Skeleton />
                            </Typography>
                            <Typography variant='body1'>
                              <Skeleton />
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography gutterBottom variant='h6'>
                              {kittygotchi.data?.name}
                            </Typography>
                            <Typography variant='body1'>
                              {kittygotchi.data?.description}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Paper>
                  </Grid>

                  {isEditing ? (
                    <Grid item xs={12}>
                      <Fade in>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              title={
                                messages[
                                  'app.kittygotchi.accessories'
                                ] as string
                              }
                              traitType={KittygotchiTraitType.ACCESSORIES}
                              items={
                                KittygotchiTraits[
                                  KittygotchiTraitType.ACCESSORIES
                                ]
                              }
                              onSelect={kittyStyles.handleSelectAccessory}
                              value={kittyStyles?.accessory}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              traitType={KittygotchiTraitType.NOSE}
                              title={
                                messages['app.kittygotchi.noses'] as string
                              }
                              items={
                                KittygotchiTraits[KittygotchiTraitType.NOSE]
                              }
                              onSelect={kittyStyles.handleSelectNose}
                              value={kittyStyles?.nose}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              traitType={KittygotchiTraitType.EARS}
                              title={messages['app.kittygotchi.ears'] as string}
                              items={
                                KittygotchiTraits[KittygotchiTraitType.EARS]
                              }
                              onSelect={kittyStyles.handleSelectEars}
                              value={kittyStyles.ears}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              traitType={KittygotchiTraitType.EYES}
                              title={messages['app.kittygotchi.eyes'] as string}
                              items={
                                KittygotchiTraits[KittygotchiTraitType.EYES]
                              }
                              onSelect={kittyStyles.handleSelectEyes}
                              value={kittyStyles.eyes}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              traitType={KittygotchiTraitType.CLOTHES}
                              title={
                                messages['app.kittygotchi.clothes'] as string
                              }
                              items={
                                KittygotchiTraits[KittygotchiTraitType.CLOTHES]
                              }
                              onSelect={kittyStyles.handleSelectCloth}
                              value={kittyStyles.cloth}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <KittygotchiTraitSelector
                              kitHolding={
                                kitHolding.data && kitHolding.data?.length > 0
                                  ? kitAmount
                                  : 0
                              }
                              traitType={KittygotchiTraitType.MOUTH}
                              title={
                                messages['app.kittygotchi.mouths'] as string
                              }
                              items={
                                KittygotchiTraits[KittygotchiTraitType.MOUTH]
                              }
                              onSelect={kittyStyles.handleSelectMouth}
                              value={kittyStyles.mouth}
                              disabled={!isEditing}
                            />
                          </Grid>
                        </Grid>
                      </Fade>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Grid container alignItems='stretch' spacing={4}>
                        {kittygotchi.isLoading
                          ? new Array(6)
                              .fill(null)
                              .map((i: any, index: number) => (
                                <Grid xs={4} key={index} item>
                                  <KittygotchiTrait loading />
                                </Grid>
                              ))
                          : kittygotchi.data?.attributes.map(
                              (attr: any, index: number) => (
                                <Grid key={index} item xs={4}>
                                  <KittygotchiTrait
                                    traitType={attr.trait_type}
                                    value={attr.value}
                                  />
                                </Grid>
                              ),
                            )}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {isMobile ? (
                <Grid item xs={12}>
                  {isEditing ? (
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Button
                          disabled={isSubmitting() || !hasChange}
                          onClick={onUpdateGotchi}
                          fullWidth
                          startIcon={
                            isSubmitting() ? (
                              <CircularProgress
                                color='inherit'
                                size={theme.spacing(7)}
                              />
                            ) : (
                              <DoneIcon />
                            )
                          }
                          variant='contained'
                          color='primary'>
                          <IntlMessages id='app.kittygotchi.save' />
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          onClick={handleCancelEdit}
                          variant='contained'
                          fullWidth>
                          <IntlMessages id='app.kittygotchi.cancel' />
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Button
                      fullWidth
                      disabled={kittygotchi.isLoading}
                      onClick={handleEdit}
                      variant='contained'
                      color='primary'
                      startIcon={<Edit />}>
                      <IntlMessages id='app.kittygotchi.edit' />
                    </Button>
                  )}
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyEdit;
