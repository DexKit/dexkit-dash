import React, {useCallback, useEffect, useState} from 'react';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  useTheme,
} from '@material-ui/core';
import {useParams} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import IntlMessages from '@crema/utility/IntlMessages';
import {truncateAddress} from 'utils';
import useFetch from 'use-http';
import {Skeleton} from '@material-ui/lab';
import AssetEventsTable from '../AssetEventsTable';

import moment from 'moment';
import ButtonCopy from 'shared/components/ButtonCopy';
import {NullValueNode} from 'graphql';
import {getWindowUrl} from 'utils/browser';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import {getOrderHash} from '@0x/order-utils';
import AssetOrdersTable from '../AssetOrdersTable';
import {useAsset, useAssetEvents, useAssetOrders} from '../hooks/detail';
import HistoricAccordion from '../components/detail/HistoricAccordion';
import ListingAccordion from '../components/detail/ListingAccordion';
import DetailAccordion from '../components/detail/DetailAccordion';
import DescriptionCard from '../components/detail/DescriptionCard';
import OffersAccordion from '../components/detail/OffersAccordion';

const useStyles = makeStyles((theme) => ({
  assetImage: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

interface RouteParams {
  address: string;
  token: string;
}

export const AssetDetail = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {address, token}: RouteParams = useParams();

  const {getAsset, loading, data, error} = useAsset();

  useEffect(() => {
    let tokenId = parseInt(token);

    getAsset(address, tokenId);
  }, [getAsset, address, token]);

  return (
    <Box pt={{xs: 8}}>
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit'>
            <IntlMessages id='nfts.walletBreadcrumbAssets' />
          </Link>
          <Link color='inherit'>
            {loading ? (
              <Skeleton width={theme.spacing(40)} />
            ) : (
              data?.collection?.name
            )}
          </Link>
          <Link
            component={RouterLink}
            color='inherit'
            to={`/nfts/assets/${address}/${token}`}>
            {loading ? <Skeleton width={theme.spacing(70)} /> : data?.name}
          </Link>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    {loading ? (
                      <Skeleton className={classes.assetImage} height='100%' />
                    ) : null}
                    <CardMedia>
                      <img
                        style={{
                          backgroundColor: `#${
                            data?.background_color
                              ? data?.background_color
                              : 'fff'
                          }`,
                        }}
                        src={data?.image_url}
                        className={classes.assetImage}
                      />
                    </CardMedia>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <DetailAccordion asset={data} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DescriptionCard asset={data} loading={loading} />
                </Grid>
                {/* <Grid item xs={12}>
                  <ListingAccordion asset={data} />
                </Grid>
                <Grid item xs={12}>
                  <OffersAccordion asset={data} />
                </Grid>
              </Grid> */}
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={12}>
          <HistoricAccordion asset={data} />
        */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetail;
