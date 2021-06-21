import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';

import React, {useEffect} from 'react';
import AssetOffersTable from './AssetOffersTable';

interface Props {
  offers: any;
}

export default (props: Props) => {
  const {offers} = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListIcon />{' '}
        <Typography variant='body1'>
          <IntlMessages id='nfts.detail.offersAccordionLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AssetOffersTable offers={offers} />
          </Grid>
          {/* <Grid item>
            <Button color='primary' variant='outlined'>
              <IntlMessages id='nfts.detail.offersMakeOffer' />
            </Button>
          </Grid> */}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
