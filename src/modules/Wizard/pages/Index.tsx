import {Box, Grid, Typography, IconButton, Tooltip} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router';
import CollectionsList from '../components/setups/erc721/CollectionsList';
import IntlMessages from '@crema/utility/IntlMessages';
import TokensList from '../components/setups/erc20/TokensList';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Web3State} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {useIntl} from 'react-intl';
import {WALLET_ROUTE} from 'shared/constants/routes';

export default () => {
  const history = useHistory();

  const handleCreateCollection = useCallback(
    (e) => {
      history.push('/wizard/deploy/collection');
    },
    [history],
  );

  const handleCreateToken = useCallback(() => {
    history.push('/wizard/deploy/token');
  }, [history]);

  const {web3State} = useWeb3();

  const isNotConnected = web3State === Web3State.NotConnected;

  const {messages} = useIntl();

  const handleBack = useCallback(
    (_ev: any) => {
      if (history.length > 0) {
        history.goBack();
      } else {
        history.push(WALLET_ROUTE);
      }
    },
    [history],
  );

  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' alignContent='center'>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                mr={2}>
                <IconButton size='small' onClick={handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Typography variant='h5'>
                <IntlMessages id='app.wizard.wizard' />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <Box display={'flex'} justifyContent={'space-between'} p={2}>
            <Box>
              <Typography variant={'h6'}>
                {' '}
                {messages['app.wizard.myCollections']}{' '}
              </Typography>
              <Typography color={'textSecondary'} variant={'body2'}>
                {' '}
                {messages['app.wizard.createAndManageYourCollections']}{' '}
              </Typography>
            </Box>
            <Box>
              <Tooltip
                title={
                  isNotConnected ? (
                    <IntlMessages id='app.wizard.notConnected' />
                  ) : (
                    ''
                  )
                }>
                <IconButton
                  disabled={isNotConnected}
                  color='primary'
                  onClick={handleCreateCollection}>
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <CollectionsList />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box display={'flex'} justifyContent={'space-between'} p={2}>
            <Box>
              <Typography variant={'h6'}>
                {' '}
                {messages['app.wizard.myTokens']}{' '}
              </Typography>
              <Typography color={'textSecondary'} variant={'body2'}>
                {' '}
                {messages['app.wizard.createAndManageYourTokens']}{' '}
              </Typography>
            </Box>
            <Box>
              <Tooltip
                title={
                  isNotConnected ? (
                    <IntlMessages id='app.wizard.notConnected' />
                  ) : (
                    ''
                  )
                }>
                <IconButton
                  disabled={isNotConnected}
                  color='primary'
                  onClick={handleCreateToken}>
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TokensList />
        </Grid>
      </Grid>
    </Box>
  );
};
