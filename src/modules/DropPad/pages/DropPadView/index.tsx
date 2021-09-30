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
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import {DROPPAD_ROUTE, HOME_ROUTE} from 'shared/constants/routes';
import {FileCopy} from '@material-ui/icons';
import {makeStyles} from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import {ShareButton} from 'shared/components/ShareButton';
import CopyButton from 'shared/components/CopyButton';
import {truncateAddress} from 'utils/text';
import {useWeb3} from 'hooks/useWeb3';

import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
} from 'react-router-dom';
import {useDrop} from 'modules/DropPad/hooks/useDrop';
import CardPrice from 'modules/DropPad/components/CardPrice';
import Countdown from 'modules/DropPad/components/Countdown';

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
  gameTypePaper: {
    backgroundColor: '#2e3243',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const DropPadView = (props: Props) => {
  const classes = useStyles();
  const {
    match: {params},
  } = props;
  const {address} = params;
  const {account, chainId} = useWeb3();
  const { drop } = useDrop(address);
  const history = useHistory();
  const handleBack = useCallback((ev: any) => {
    history.push(DROPPAD_ROUTE);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} xl={12}>
        <Breadcrumbs
          style={{color: '#fff', fontSize: '0.75rem'}}
          separator={<NavigateNextIcon fontSize='small' />}>
          <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
            Dashboard
          </Link>
          <Link color='inherit' component={RouterLink} to={DROPPAD_ROUTE}>
            Drops
          </Link>
          <Link
            color='inherit'
            component={RouterLink}
            to={`${DROPPAD_ROUTE}/${address}`}>
            {truncateAddress(address)}
          </Link>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={8} sm={8} xl={8}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h5' style={{margin: 5}}>
            Drop #{truncateAddress(address)}
            <CopyButton size='small' copyText={account || ''} tooltip='Copied!'>
              <FileCopy color='inherit' style={{fontSize: 16}} />
            </CopyButton>
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sm={4} xl={4}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ShareButton shareText={`Drop #Id ${address}`} />
          <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
        </Box>
      </Grid>
      {drop && (
        <>
          <Grid item xs={4}>
            <CardPrice price={drop.price} />
          </Grid>
          {drop.earlyAccessDate && (
            <Grid item xs={4}>
              <Countdown
                title={'Early Access Countdown'}
                timestamp={drop.earlyAccessDate}
              />
            </Grid>
          )}
          <Grid item xs={4}>
            <Countdown
              title={'Open Access Countdown'}
              timestamp={drop.startDate}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DropPadView;
