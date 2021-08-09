import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
  Box,
  Button,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import React, {useCallback, useEffect, useState} from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import AssetEventsTable from './AssetEventsTable';
import {sortEventArray} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';
import {useAssetEvents} from 'modules/NFTWallet/hooks/detail';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import AssetEventsTableSkeleton from './AssetEventsTableSkeleton';

interface Props {
  asset: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {asset} = props;
  const theme = useTheme();
  const {getEvents} = useAssetEvents();
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState();

  const fetchData = useCallback(() => {
    if (!hasMore) {
      return;
    }

    setLoading(true);

    getEvents(asset?.asset_contract?.address, asset?.token_id, page)
      .then((response) => {
        console.log(response);

        const result = response.data?.asset_events;

        if (result?.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        const newData = [...data, ...result];

        setData(newData);
      })
      .catch((reason) => {
        setError(reason.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, asset, page, hasMore]);

  const handleLoadMore = useCallback(() => {
    setPage((value) => value + 1);
    fetchData();
  }, [fetchData, data, getEvents, asset]);

  useEffect(() => {
    if (asset) {
      setTimeout(() => {
        fetchData();
      }, 2000);
    }
  }, [asset]);

  const handleChange = useCallback(() => setExpanded((value) => !value), []);

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SwapVertIcon />{' '}
        <Typography>
          <IntlMessages id='nfts.detail.historicLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{display: 'block'}}>
        {loading && data?.length < 20 ? (
          <Box py={8}>
            <Grid container justify='center' alignItems='center'>
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            {data?.length > 0 ? (
              <AssetEventsTable events={data ? sortEventArray(data) : []} />
            ) : null}
            {data?.length > 0 && hasMore ? (
              <Box mt={4}>
                <Button
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={theme.spacing(4)}
                        color='inherit'
                      />
                    ) : null
                  }
                  color='primary'
                  onClick={handleLoadMore}
                  variant='outlined'
                  fullWidth>
                  Load More
                </Button>
              </Box>
            ) : null}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
