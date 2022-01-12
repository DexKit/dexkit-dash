import React from 'react';
import {
  Drawer,
  Grid,
  Box,
  Divider,
  Typography,
  IconButton,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import CloseIcon from '@material-ui/icons/Close';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const NftsFilterDrawer: React.FC<Props> = ({open, onClose}) => {
  return (
    <Drawer open={open} anchor='right' onClose={onClose}>
      <Box p={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box mb={2}>
              <Grid container justify='space-between' alignItems='center'>
                <Grid item>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <FilterSearchIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>
                        <IntlMessages id='app.dashboard.filter' />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton size='small' onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom variant='body1'>
              <IntlMessages id='app.dashboard.network' />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default NftsFilterDrawer;
