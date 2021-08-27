import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';
import React from 'react';

type Props = {
  title: string;
  message: string;
};

export const Empty = (props: Props) => {
  const {title, message} = props;

  return (
    <Box py={4}>
      <Grid
        container
        alignItems='center'
        alignContent='center'
        justify='center'
        direction='column'
        spacing={2}>
        <Grid item xs={12}>
          <ConnectivityImage />
        </Grid>
        <Grid item xs={12}>
          <Typography
            style={{textTransform: 'uppercase'}}
            gutterBottom
            align='center'
            variant='h5'>
            {title}
          </Typography>
          <Typography align='center'>{message}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
