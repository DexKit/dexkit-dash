import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
} from '@material-ui/core';

import moment from 'moment';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PointsHistoryCard from '../components/buttons/PointsHistoryCard';
import ProfilePointsCard from '../components/ProfilePointsCard';
import { useMobile } from 'hooks/useMobile';

export function Ranking() {
  const isMobile = useMobile();
  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          {isMobile && <Grid item xs={12}>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to='/profile'>
                Profile
              </Link>
            </Breadcrumbs>
          </Grid>}
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' alignContent='center'>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                mr={2}>
                <IconButton size='small' component={RouterLink} to='/profile'>
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Typography variant='h5'>Points history</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <ProfilePointsCard amount={100} maxAmount={500} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography gutterBottom variant='h6'>
            Points history
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <PointsHistoryCard
                icon='crown'
                label='0xasd87asd79asd7sa8d7as8dad'
                date={moment()}
              />
            </Grid>
            <Grid item xs={12}>
              <PointsHistoryCard
                icon='gift'
                label='0xasd87asd79asd7sa8d7as8dad'
                date={moment()}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Ranking;
