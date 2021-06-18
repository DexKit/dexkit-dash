import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';

import React, {useEffect} from 'react';

interface Props {
  asset: any;
}

export default (props: Props) => {
  const {asset} = props;

  useEffect(() => {}, [asset]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListIcon />{' '}
        <Typography variant='body1'>
          <IntlMessages id='nfts.detail.offersAccordionLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
  );
};
