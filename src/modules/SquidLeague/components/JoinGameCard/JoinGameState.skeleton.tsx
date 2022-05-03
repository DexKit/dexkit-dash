import React from 'react';
import {Paper, Box, Grid, Typography, Button} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {Skeleton} from '@material-ui/lab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export const JoinGameStateSkeleton = () => {
  return (
    <Grid
      container
      spacing={4}
      alignItems='center'
      alignContent='center'
      justifyContent='center'>
      <Grid item xs={12} sm={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Box p={2}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Box>
                    <Skeleton>
                      <Typography color='textSecondary' variant='caption'>
                        <IntlMessages
                          id='squidLeague.gameStartsIn'
                          defaultMessage={'Game starts in'}
                        />
                      </Typography>
                    </Skeleton>
                    <Skeleton>
                      <Typography variant='h5' color='textPrimary'>
                        0123123101023
                      </Typography>
                    </Skeleton>
                  </Box>
                  <Box>Icon</Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Box p={2}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Box>
                    <Skeleton>
                      {' '}
                      <Typography color='textSecondary' variant='caption'>
                        <IntlMessages
                          id='squidLeague.entry'
                          defaultMessage={'Entry'}
                        />
                      </Typography>
                    </Skeleton>
                    <Typography variant='h5' color='textPrimary'>
                      <Skeleton> 0.0001 MATIC</Skeleton>
                    </Typography>
                  </Box>
                  <Box>
                    <Skeleton> Icon </Skeleton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Skeleton>
              <Button
                fullWidth
                startIcon={<ArrowDownwardIcon />}
                variant='outlined'
                color='primary'>
                <IntlMessages
                  id='squidLeague.joinGame'
                  defaultMessage={'Join Game'}
                />
              </Button>
            </Skeleton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
