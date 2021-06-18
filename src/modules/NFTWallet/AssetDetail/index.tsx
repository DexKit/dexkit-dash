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
import {useAssetEvents, useAssetOrders} from '../hooks/detail';
import HistoricAccordion from '../components/detail/HistoricAccordion';
import ListingAccordion from '../components/detail/ListingAccordion';
import DetailAccordion from '../components/detail/DetailAccordion';

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
  const {get, loading, error} = useFetch('https://api.opensea.io/api/v1/asset');

  const [data, setData] = useState<any>({});

  useEffect(() => {
    let tokenId = parseInt(token);

    get(`/${address}/${tokenId}/`).then(() => {
      if (data) {
        setData(data);
      }
    });
  }, [get, address, token]);

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
        <Grid item xs={12} sm={4}>
          <Card>
            {loading ? (
              <Skeleton className={classes.assetImage} height='100%' />
            ) : null}
            <CardMedia>
              <img
                style={{
                  backgroundColor: `#${
                    data?.background_color ? data?.background_color : 'fff'
                  }`,
                }}
                src={data?.image_url}
                className={classes.assetImage}
              />
            </CardMedia>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Link>
                <Typography variant='body1'>
                  {loading ? <Skeleton /> : data?.collection?.name}
                </Typography>
              </Link>

              <Typography
                style={{fontWeight: 700}}
                gutterBottom
                variant='h4'
                component='h1'>
                {loading ? (
                  <Skeleton />
                ) : (
                  <>
                    {data?.name}
                    <ButtonCopy
                      copyText={`${getWindowUrl()}/nfts/assets/${address}/${token}`}
                      titleText='Copied to Clipboard'
                    />
                  </>
                )}
              </Typography>
              <Typography variant='body1' color='textSecondary'>
                {loading ? <Skeleton /> : data?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <DetailAccordion asset={data} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ListingAccordion contractAddress={address} tokenId={token} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <HistoricAccordion contractAddress={address} tokenId={token} />
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AssetDetail;
