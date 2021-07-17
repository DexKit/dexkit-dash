import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Backdrop,
  Box,
  Paper,
  Grid,
  makeStyles,
  Typography,
  CircularProgress,
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
  icon: {
    fontSize: theme.spacing(16),
  },
}));

interface Props {
  open: boolean;
}

export default (props: Props) => {
  const {open} = props;
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <Paper>
        <Box p={4}>
          <Grid
            alignItems='center'
            justify='center'
            alignContent='center'
            container
            spacing={4}>
            <Grid item>
              <CircularProgress className={classes.icon} />
            </Grid>
            <Grid item xs>
              <Grid
                justify='center'
                alignItems='center'
                alignContent='center'
                direction='column'
                container
                spacing={4}>
                <Grid item>
                  <Typography gutterBottom variant='h5'>
                    <IntlMessages id='nfts.detail.backdrop.cancellingOffer' />
                  </Typography>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.detail.backdrop.pleaseSignTransaction' />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Backdrop>
  );
};
