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
} from '@material-ui/core';
import {useParams} from 'react-router';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import IntlMessages from '@crema/utility/IntlMessages';
import {truncateAddress} from 'utils';
import useFetch from 'use-http';
import {Skeleton} from '@material-ui/lab';
import AssetEventsTable from '../AssetEventsTable';

const useStyles = makeStyles((theme) => ({
  assetImage: {
    padding: '66.6%',
  },
}));

interface RouteParams {
  address: string;
  token: string;
}

export const AssetDetail = () => {
  const classes = useStyles();

  const {get, data, loading} = useFetch('https://api.opensea.io/api/v1/asset');

  const {address, token}: RouteParams = useParams();

  useEffect(() => {
    get(`/${address}/${token}/`);
  }, [get, address, token]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            {loading ? <Skeleton height={300} /> : null}
            <CardMedia image={data?.image_url} className={classes.assetImage} />
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Link>
                <Typography variant='body1'>
                  {loading ? <Skeleton /> : data?.asset_contract.name}
                </Typography>
              </Link>
              <Typography gutterBottom variant='h5' component='h1'>
                {loading ? <Skeleton /> : data?.name}
              </Typography>
              <Typography variant='body1' color='textSecondary'>
                {loading ? <Skeleton /> : data?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SubjectIcon />{' '}
              <Typography>
                <IntlMessages id='nfts.detail.detailLabel' />
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{display: 'block'}}>
              <Box p={2}>
                <Grid container justify='space-between'>
                  <Grid item>
                    <Typography variant='body1'>
                      <IntlMessages id='nfts.detail.detailContractAddress' />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      <Link
                        href={`https://etherscan.io/address/${data?.asset_contract.address}`}
                        target='_blank'>
                        {truncateAddress(data?.asset_contract.address)}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justify='space-between'>
                  <Grid item>
                    <Typography variant='body1'>
                      <IntlMessages id='nfts.detail.detailTokenIdLabel' />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>{data?.token_id}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SubjectIcon />{' '}
              <Typography>
                <IntlMessages id='nfts.detail.eventsLabel' />
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{display: 'block'}}>
              <AssetEventsTable events={[]} />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetail;
