import IntlMessages from '@crema/utility/IntlMessages';
import {Accordion, AccordionDetails, AccordionSummary} from '@material-ui/core';
import AssetOrdersTable from 'modules/NFTWallet/AssetOrdersTable';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import React, {useEffect} from 'react';
import {useAssetOrders} from 'modules/NFTWallet/hooks/detail';

interface Props {
  contractAddress: string;
  tokenId: string;
}

export default (props: Props) => {
  const {contractAddress, tokenId} = props;

  const {getOrders, data, loading, error} = useAssetOrders();

  useEffect(() => {
    getOrders(contractAddress, parseInt(tokenId));
  }, [getOrders, contractAddress, tokenId]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <LocalOfferIcon />{' '}
        <IntlMessages id='nfts.detail.listingAccordionLabel' />
      </AccordionSummary>
      <AccordionDetails>
        <AssetOrdersTable
          orders={data?.asset_orders ? data?.asset_orders : []}
        />
      </AccordionDetails>
    </Accordion>
  );
};
