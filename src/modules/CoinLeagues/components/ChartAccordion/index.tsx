import React, {useRef, useState, useEffect} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShowChart from '@material-ui/icons/ShowChart';
import ChartTV from '../ChartTV';

export default () => {
 

  return (
    <Accordion style={{ background: '#2e3243'}} >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display='flex' alignItems='center'>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant='body1'>
                <ShowChart fontSize='inherit' />
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>
                <IntlMessages id='coinleagues.charts' />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
            <ChartTV />
      </AccordionDetails>
    </Accordion>
  );
};
