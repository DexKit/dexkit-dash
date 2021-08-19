import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Avatar,
  Link,
  ListItemSecondaryAction,
  Paper,
  CardHeader,
  Breadcrumbs,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router';
import FeatureButton from '../components/FeatureButton';
import CollectionsList from '../components/setups/erc721/CollectionsList';
import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import TokensList from '../components/setups/erc20/TokensList';

export default () => {
  const history = useHistory();

  const handleCreateCollection = useCallback(
    (e) => {
      history.push('/wizard/deploy/collection');
    },
    [history],
  );

  const handleInteractClick = useCallback(
    (e) => {
      history.push('/wizard/contract');
    },
    [history],
  );

  return (
    <Box py={{xs: 8}}>
      <Box mb={4}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to='/wizard'>
            Wizard
          </Link>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title='My Collections'
              subheader='Create and manage your collections'
              subheaderTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
              }}
              action={
                <IconButton color='primary' onClick={handleCreateCollection}>
                  <Add />
                </IconButton>
              }
            />
            <CollectionsList />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title='My Tokens' />
            <TokensList />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
