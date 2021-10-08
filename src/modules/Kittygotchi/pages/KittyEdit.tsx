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
import {useKittygotchi} from '../hooks';
import {ColorCircle} from '../components/ColorCircle';

const COLORS: string[] = [];

const useStyles = makeStyles((theme) => ({
  kittygotchiBackground: {},
}));

interface Params {
  id: string;
}

export const KittyEdit = () => {
  const classes = useStyles();
  const theme = useTheme();

  const params = useParams<Params>();

  const rewardToggler = useToggler(false);

  const kittygotchi = useKittygotchi();

  useEffect(() => {
    if (params.id) {
      kittygotchi.get(params.id);
    }
  }, [params.id]);

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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box className={classes.kittygotchiBackground}></Box>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Box
                p={2}
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='space-between'>
                <IconButton>
                  <NavigateBeforeIcon />
                </IconButton>
                <Typography variant='body1'>Accessories</Typography>
                <IconButton>
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {COLORS.map((color: string, index: number) => (
                <Grid item key={index}>
                  <ColorCircle color={color} selected />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              startIcon={<DoneIcon />}
              variant='contained'
              color='primary'>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyEdit;
