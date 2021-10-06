import React from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  Divider,
  CardContent,
  Card,
  LinearProgress,
  withStyles,
  CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  atkLinearColor: {
    backgroundColor: '#B892FF',
  },
  defLinearColor: {
    backgroundColor: '#7765E3',
  },
  runLinearColor: {
    backgroundColor: '#60A561',
  },
  circularProgress: {},
  avatar: {},
}));

const CustomLinearProgress = withStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#343A49',
    height: theme.spacing(2),
  },
  bar: {},
}))(LinearProgress);

const CustomCircularProgress = withStyles((theme) => ({}))(CircularProgress);

export const ProfileIndex = () => {
  const classes = useStyles();

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <img className={classes.avatar} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                mb={1}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                alignContent='center'>
                <Typography variant='body1'>Atk</Typography>
                <Typography variant='body1'>213</Typography>
              </Box>
              <CustomLinearProgress classes={{bar: classes.atkLinearColor}} />
            </Grid>
            <Grid item xs={12}>
              <Box
                mb={1}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                alignContent='center'>
                <Typography variant='body1'>Def</Typography>
                <Typography variant='body1'>2123</Typography>
              </Box>
              <CustomLinearProgress classes={{bar: classes.defLinearColor}} />
            </Grid>
            <Grid item xs={12}>
              <Box
                mb={1}
                justifyContent='space-between'
                display='flex'
                alignItems='center'
                alignContent='center'>
                <Typography variant='body1'>Run</Typography>
                <Typography variant='body1'>222</Typography>
              </Box>
              <CustomLinearProgress classes={{bar: classes.runLinearColor}} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1'>Points</Typography>
          <Card>
            <CardContent>
              <Box
                display='flex'
                alignContent='center'
                alignItems='center'
                justifyContent='center'>
                <Box>
                  <CustomCircularProgress variant='determinate' value={30} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileIndex;
