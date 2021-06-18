import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
} from '@material-ui/core';
import AssetOrdersTable from 'modules/NFTWallet/AssetOrdersTable';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import React, {useEffect} from 'react';
import {useAssetOrders} from 'modules/NFTWallet/hooks/detail';

interface Props {
  asset: any;
}

export default (props: Props) => {
  const {asset} = props;

  const {getOrders, data, loading, error} = useAssetOrders();

  useEffect(() => {
    getOrders(asset?.asset_contract?.address, parseInt(asset?.token_id));
  }, [getOrders, asset]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <LocalOfferIcon />{' '}
        <Typography variant='body1'>
          <IntlMessages id='nfts.detail.listingAccordionLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AssetOrdersTable
          orders={data?.asset_orders ? data?.asset_orders : []}
        />
      </AccordionDetails>
    </Accordion>
  );
};
