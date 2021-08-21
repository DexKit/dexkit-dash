import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import AssetOrdersTable from '../../components/detail/AssetListingsTable';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import React, {useCallback, useEffect, useState} from 'react';
import NotesIcon from '@material-ui/icons/Notes';

interface Props {
  listings: any;
  loading?: boolean;
  error?: any;
  onCancel: (listing: any) => void;
  onBuy: (listing: any) => void;
}

export default (props: Props) => {
  const {listings, onCancel, onBuy} = props;

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <LocalOfferIcon />{' '}
          <Typography variant='body1'>
            <IntlMessages id='nfts.detail.listingAccordionLabel' />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {listings?.length > 0 ? (
            <AssetOrdersTable
              onCancel={onCancel}
              onBuy={onBuy}
              listings={listings}
            />
          ) : (
            <Box display='block' width='100%' py={4}>
              <Grid
                direction='column'
                container
                spacing={2}
                justify='center'
                alignItems='center'>
                <Grid item>
                  <NotesIcon color='disabled' />
                </Grid>
                <Grid item>
                  <Typography
                    color='textSecondary'
                    align='center'
                    variant='body1'>
                    <IntlMessages id='nfts.detail.noListingsYet' />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
