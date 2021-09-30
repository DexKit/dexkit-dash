import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
  Breadcrumbs,
  Button,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {
  DROPPAD_ROUTE,
  HOME_ROUTE,
  LOGIN_WALLET_ROUTE,
} from 'shared/constants/routes';

import {makeStyles} from '@material-ui/core/styles';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import {useDrops} from 'modules/DropPad/hooks/useDrops';
import DropCard from 'modules/DropPad/components/DropCard';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(2),
    backgroundColor: '#1F1D2B',
  },
  chip: {
    color: '#fff',
    background: '#1F1D2B',
    border: '2px solid #2e3243',
  },
  createGame: {
    padding: theme.spacing(3),
  },
}));

const DropPadList = () => {
  const history = useHistory();
  const drops = useDrops();
  const classes = useStyles();
  return (
    <Grid container spacing={4} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs
            style={{color: '#fff', fontSize: '0.75rem'}}
            separator={<NavigateNextIcon fontSize='small' />}>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              Dashboard
            </Link>
            <Link color='inherit' component={RouterLink} to={DROPPAD_ROUTE}>
              Drops
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid item xs={6} xl={6} sm={6}>
        <Typography variant='h5'>DropPad</Typography>
      </Grid>
      <Grid item xs={6} sm={6} xl={6}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ShareButton shareText={`Drops`} />
          <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Typography variant='h6' style={{margin: 5}}>
        Listed Drops: {drops?.length || 0}
        </Typography>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={12}>
        <Grid container spacing={4} alignItems={'center'}>
          <Grid item xs={12} sm={12} md={12}>
            {drops.map((d) => (
              <DropCard drop={d} onClick={(address: string) => history.push(`${DROPPAD_ROUTE}/view/${address}`)} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DropPadList;
