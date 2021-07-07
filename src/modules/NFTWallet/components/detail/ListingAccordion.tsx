import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import AssetOrdersTable from './AssetListingsTable';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import React, {useCallback, useEffect, useState} from 'react';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import {getOpenSeaPort} from 'utils/opensea';
import CancellingListingBackdrop from './CancellingListingBackdrop';

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
          <AssetOrdersTable
            onCancel={onCancel}
            onBuy={onBuy}
            listings={listings}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
