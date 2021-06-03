import React from 'react';
import {Box, Card, Fade, Grid} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

interface Props {}

const LoadingStatistics: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Fade in={true} timeout={1000}>
          <Card>
            <Box
              padding={3}
              display='flex'
              alignItems='center'
              borderRadius={5}
              boxShadow={1}>
              <Skeleton variant='rect' width={50} height={50} />
              <Box position='relative' ml={2}>
                <Box mb={1}>
                  <Skeleton variant='text' width={120} />
                </Box>
                <Box component='h4' display='inline-block' style={{padding: 0}}>
                  <Skeleton variant='text' width={120} />
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Fade in={true} timeout={1000}>
          <Card>
            <Box
              padding={3}
              display='flex'
              alignItems='center'
              borderRadius={5}
              boxShadow={1}>
              <Skeleton variant='rect' width={50} height={50} />
              <Box position='relative' ml={2}>
                <Box mb={1}>
                  <Skeleton variant='text' width={120} />
                </Box>
                <Box component='h4' display='inline-block' style={{padding: 0}}>
                  <Skeleton variant='text' width={120} />
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Fade in={true} timeout={1000}>
          <Card>
            <Box
              padding={3}
              display='flex'
              alignItems='center'
              borderRadius={5}
              boxShadow={1}>
              <Skeleton variant='rect' width={50} height={50} />
              <Box position='relative' ml={2}>
                <Box mb={1}>
                  <Skeleton variant='text' width={120} />
                </Box>
                <Box component='h4' display='inline-block' style={{padding: 0}}>
                  <Skeleton variant='text' width={120} />
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Fade in={true} timeout={1000}>
          <Card>
            <Box
              padding={3}
              display='flex'
              alignItems='center'
              borderRadius={5}
              boxShadow={1}>
              <Skeleton variant='rect' width={50} height={50} />
              <Box position='relative' ml={2}>
                <Box mb={1}>
                  <Skeleton variant='text' width={120} />
                </Box>
                <Box component='h4' display='inline-block' style={{padding: 0}}>
                  <Skeleton variant='text' width={120} />
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      </Grid>
    </Grid>
  );
};

export default LoadingStatistics;
