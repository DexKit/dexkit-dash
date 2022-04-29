import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Link,
  CardHeader,
  Breadcrumbs,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router';
import CollectionsList from '../components/setups/erc721/CollectionsList';
import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import TokensList from '../components/setups/erc20/TokensList';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Web3State} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {useIntl} from 'react-intl';
import {useMobile} from 'hooks/useMobile';
import {WALLET_ROUTE} from 'shared/constants/routes';

export default () => {
  const history = useHistory();
  const isMobile = useMobile();

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
          {!isMobile && (
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to='/'>
                  <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                </Link>
                <Link color='inherit' component={RouterLink} to='/wizard'>
                  <IntlMessages id='app.wizard.wizard' />
                </Link>
              </Breadcrumbs>
            </Grid>
          )}
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
              <Typography variant='h6'>
                <IntlMessages id='app.wizard.wizard' />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title={messages['app.wizard.myCollections']}
              subheader={messages['app.wizard.createAndManageYourCollections']}
              subheaderTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
              }}
              action={
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
              }
            />
            <Divider />
            <CollectionsList />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title={messages['app.wizard.myTokens']}
              subheader={messages['app.wizard.createAndManageYourTokens']}
              subheaderTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
              }}
              action={
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
              }
            />
            <Divider />
            <TokensList />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
