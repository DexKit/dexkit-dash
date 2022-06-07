import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShowChart from '@material-ui/icons/ShowChart';
import ChartTV from '../ChartTV';
import {useMobile} from 'hooks/useMobile';
export default () => {
  const isMobile = useMobile();

  return (
    <Accordion style={{background: '#2e3243'}}>
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
      <AccordionDetails>{!isMobile && <ChartTV />}</AccordionDetails>
    </Accordion>
  );
};
