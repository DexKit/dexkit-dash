import React from 'react';
import {Box, Grid} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

interface Props {}

const LoadingInfo: React.FC<Props> = (props) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display='flex' alignItems={'center'} mb={2}>
          <Skeleton variant='circle' width={40} height={40} />
          <Box component='h3' pl={2}>
            <Skeleton variant='text' width={120} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box mb={3} component='div'>
          <Skeleton variant='text' width='100%' />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box component='strong'>
          <Skeleton variant='text' width={120} />
        </Box>
        <Box component='div'>
          <Skeleton variant='text' width={120} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box component='strong'>
          <Skeleton variant='text' width={120} />
        </Box>
        <Box component='div'>
          <Skeleton variant='text' width={120} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box component='strong'>
          <Skeleton variant='text' width={120} />
        </Box>
        <Box component='div'>
          <Skeleton variant='text' width={120} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoadingInfo;
