import React, {useState, useCallback, useEffect} from 'react';

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
import {KittygotchiTraits, KittygotchiTraitType} from '../constants';
import {useIntl} from 'react-intl';
import {useMobile} from 'hooks/useMobile';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';

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

  useEffect(() => {
    kittygotchi.get(params.id);
  }, [params.id]);

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
                  <Grid item xs={12}>
                    {!isMobile ? (
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
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      defaultExpanded
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      title={messages['app.kittygotchi.body'] as string}
                      traitType={KittygotchiTraitType.BODY}
                      items={KittygotchiTraits[KittygotchiTraitType.BODY]}
                      onSelect={kittyStyles.handleSelectBody}
                      value={kittyStyles?.body}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      title={messages['app.kittygotchi.accessories'] as string}
                      traitType={KittygotchiTraitType.ACESSOIRES}
                      items={KittygotchiTraits[KittygotchiTraitType.ACESSOIRES]}
                      onSelect={kittyStyles.handleSelectAccessory}
                      value={kittyStyles?.accessory}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      traitType={KittygotchiTraitType.NOSE}
                      title={messages['app.kittygotchi.noses'] as string}
                      items={KittygotchiTraits[KittygotchiTraitType.NOSE]}
                      onSelect={kittyStyles.handleSelectNose}
                      value={kittyStyles?.nose}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      traitType={KittygotchiTraitType.EARS}
                      title={messages['app.kittygotchi.ears'] as string}
                      items={KittygotchiTraits[KittygotchiTraitType.EARS]}
                      onSelect={kittyStyles.handleSelectEars}
                      value={kittyStyles.ears}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      traitType={KittygotchiTraitType.EYES}
                      title={messages['app.kittygotchi.eyes'] as string}
                      items={KittygotchiTraits[KittygotchiTraitType.EYES]}
                      onSelect={kittyStyles.handleSelectEyes}
                      value={kittyStyles.eyes}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={
                        kitHolding.data && kitHolding.data?.length > 0
                          ? kitHolding.data[0]?.balance?.toNumber()
                          : 0
                      }
                      traitType={KittygotchiTraitType.MOUTH}
                      title={messages['app.kittygotchi.mouths'] as string}
                      items={KittygotchiTraits[KittygotchiTraitType.MOUTH]}
                      onSelect={kittyStyles.handleSelectMouth}
                      value={kittyStyles.mouth}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {isMobile ? (
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
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyEdit;
