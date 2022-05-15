import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';
import React from 'react';

type Props = {
  title: string;
  message: string;
  image?: React.ReactNode;
  callToAction?: React.ReactNode;
};

export const Empty = (props: Props) => {
  const {title, message, image, callToAction} = props;

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
          {image ? image : <ConnectivityImage />}
        </Grid>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            align='center'
            variant='body2'
            color={'textSecondary'}>
            {title}
          </Typography>
          <Typography align='center'>{message}</Typography>
        </Grid>
        {callToAction && (
          <Grid item xs={12}>
            {callToAction}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
