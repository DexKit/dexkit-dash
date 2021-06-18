import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import AssetEventsTable from 'modules/NFTWallet/AssetEventsTable';
import {sortEventArray} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';
import {useAssetEvents} from 'modules/NFTWallet/hooks/detail';

interface Props {
  asset: any;
}

export default (props: Props) => {
  const {asset} = props;
  const {getEvents, data, loading, error} = useAssetEvents();

  useEffect(() => {
    getEvents(asset?.asset_contract?.address, parseInt(asset?.token_id));
  }, [getEvents, asset]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SubjectIcon />{' '}
        <Typography>
          <IntlMessages id='nfts.detail.historicLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{display: 'block'}}>
        <AssetEventsTable
          events={data?.asset_events ? sortEventArray(data?.asset_events) : []}
        />
      </AccordionDetails>
    </Accordion>
  );
};
