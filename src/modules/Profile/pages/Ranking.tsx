import React from 'react';

import {Link as RouterLink} from 'react-router-dom';
import {
  Box,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RankingButton from '../components/buttons/RankingButton';

export function Ranking() {
  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to='/'>
                Wallet
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' alignContent='center'>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                mr={2}>
                <IconButton size='small' component={RouterLink} to='/'>
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Typography variant='h5'>Ranking</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography gutterBottom variant='h6'>
            Your position
          </Typography>
          <RankingButton
            position={1}
            address='0xasd87asd79asd7sa8d7as8dad'
            onClick={(address) => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom variant='h6'>
            Ranking
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <RankingButton
                featured
                position={1}
                address='0xasd87asd79asd7sa8d7as8dad'
                onClick={(address) => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <RankingButton
                address='0xasd87asd79asd7sa8d7as8dad'
                position={2}
                onClick={(address) => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <RankingButton
                address='0xasd87asd79asd7sa8d7as8dad'
                position={3}
                onClick={(address) => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <RankingButton
                position={4}
                address='0xasd87asd79asd7sa8d7as8dad'
                onClick={(address) => {}}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Ranking;
