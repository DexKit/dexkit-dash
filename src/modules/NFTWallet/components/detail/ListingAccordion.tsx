import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
} from '@material-ui/core';
import AssetOrdersTable from 'modules/NFTWallet/AssetListingsTable';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import React, {useEffect} from 'react';
import {useAssetOrders} from 'modules/NFTWallet/hooks/detail';

interface Props {
  listings: any;
}

export default (props: Props) => {
  const {listings} = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <LocalOfferIcon />{' '}
        <Typography variant='body1'>
          <IntlMessages id='nfts.detail.listingAccordionLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AssetOrdersTable listings={listings} />
      </AccordionDetails>
    </Accordion>
  );
};
