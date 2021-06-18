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
  contractAddress: string;
  tokenId: string;
}

export default (props: Props) => {
  const {contractAddress, tokenId} = props;
  const {getEvents, data, loading, error} = useAssetEvents();

  useEffect(() => {
    getEvents(contractAddress, parseInt(tokenId));
  }, [getEvents, contractAddress, tokenId]);

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
