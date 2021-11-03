import React, {useState, useCallback, useEffect} from 'react';

import clsx from 'clsx';

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
} from '@material-ui/core';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import {FastFoodOutlineIcon, GiftIcon} from 'shared/components/Icons';

import DoneIcon from '@material-ui/icons/Done';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useParams} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {useToggler} from 'hooks/useToggler';
import {
  useKitHolding,
  useKittygotchi,
  useKittygotchiStyleEdit,
  useKittygotchiUpdate,
} from '../hooks';

import {SubmitState} from '../components/ButtonState';
import KittygotchiImage from '../components/images/KittygotchiImage';
import KittygotchiTraitSelector from '../components/KittygotchiTraitSelector';
import {KittygotchiTraits, KittygotchiTraitType} from '../constants';

const COLORS: string[] = [];

const useStyles = makeStyles((theme) => ({}));

interface Params {
  id: string;
}

export const KittyEdit = () => {
  const classes = useStyles();
  const theme = useTheme();

  const params = useParams<Params>();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const rewardToggler = useToggler(false);

  const kittygotchi = useKittygotchi(params.id);
  const {onUpdateKittyCallback} = useKittygotchiUpdate();

  const onUpdateGotchi = useCallback(
    (_ev: any) => {
      setSubmitState(SubmitState.WaitingWallet);
      const onSubmitTx = (hash?: string) => {
        setSubmitState(SubmitState.Submitted);
      };
      const onConfirmTx = (hash?: string) => {
        // Save here the current id minted
        setSubmitState(SubmitState.Confirmed);
      };
      const onError = (error?: any) => {
        setSubmitState(SubmitState.Error);
        setTimeout(() => {
          setSubmitState(SubmitState.None);
        }, 3000);
      };

      onUpdateKittyCallback({} as any, {
        onConfirmation: onConfirmTx,
        onError,
        onSubmit: onSubmitTx,
      });
    },
    [onUpdateKittyCallback],
  );

  const kitHolding = useKitHolding();
  const kittyStyles = useKittygotchiStyleEdit();

  const handleSelectAccessory = useCallback(() => {}, []);

  return (
    <>
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
                <Typography variant='h5'>Editting #1</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container justifyContent='center' spacing={4}>
          <Grid item xs={12} sm={10}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Paper>
                  <Box p={4}>
                    <KittygotchiImage
                      images={[
                        require('assets/images/kittygotchi/body/body.png'),
                        require('assets/images/kittygotchi/ears/fun.png'),
                        require('assets/images/kittygotchi/eyes/flash.png'),
                        require('assets/images/kittygotchi/nose/fan.png'),
                        require('assets/images/kittygotchi/mouth/angry.png'),
                        require('assets/images/kittygotchi/clothes/tour.png'),
                        require('assets/images/kittygotchi/accessories/flower.png'),
                      ]}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={0}
                      title='Accessories'
                      items={KittygotchiTraits[KittygotchiTraitType.ACESSOIRES]}
                      onSelect={handleSelectAccessory}
                      selecteds={[]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <KittygotchiTraitSelector
                      kitHolding={0}
                      title='Accessories'
                      items={KittygotchiTraits[KittygotchiTraitType.ACESSOIRES]}
                      onSelect={handleSelectAccessory}
                      selecteds={[]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  startIcon={<DoneIcon />}
                  onClick={onUpdateGotchi}
                  variant='contained'
                  color='primary'>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyEdit;
