import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, {useCallback, useEffect, useState} from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import AssetEventsTable from 'modules/NFTWallet/AssetEventsTable';
import {sortEventArray} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';
import {useAssetEvents} from 'modules/NFTWallet/hooks/detail';

import SwapVertIcon from '@material-ui/icons/SwapVert';

interface Props {
  asset: any;
}

export default (props: Props) => {
  const {asset} = props;
  const theme = useTheme();
  const {getEvents, data, loading, error} = useAssetEvents();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    getEvents(asset?.asset_contract?.address, parseInt(asset?.token_id));
  }, [getEvents, asset]);

  const handleChange = useCallback(() => setExpanded((value) => !value), []);

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SwapVertIcon />{' '}
        <Typography>
          <IntlMessages id='nfts.detail.historicLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          display: 'block',
          maxHeight: theme.spacing(100),
          overflowY: 'scroll',
        }}>
        <AssetEventsTable
          events={data?.asset_events ? sortEventArray(data?.asset_events) : []}
        />
      </AccordionDetails>
    </Accordion>
  );
};
