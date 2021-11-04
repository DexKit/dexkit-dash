import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  withStyles,
  alpha,
  LinearProgress,
  CircularProgress,
  useTheme,
  ButtonBase,
  Paper,
  makeStyles,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {GiftIcon} from 'shared/components/Icons';

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
  avatar: {
    width: theme.spacing(40),
    height: theme.spacing(40),
  },
  relative: {
    position: 'relative',
  },
  collectRewardButton: {
    display: 'block',
    width: '100%',
  },
  collectRewardButtonIconSquare: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: alpha(theme.palette.common.white, 0.12),
    borderStyle: 'solid',
  },
}));

// const CustomLinearProgress = withStyles((theme) => ({
//   root: {
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: '#343A49',
//     height: theme.spacing(3),
//   },
//   bar: {},
// }))(LinearProgress);

const CustomCircularProgress = withStyles((theme) => ({
  circle: {
    strokeLinecap: 'round',
  },
}))(CircularProgress);

const CustomBackgroundCircularProgress = withStyles((theme) => ({
  circle: {
    color: '#1F1D2B',
  },
}))(CircularProgress);

interface ProfilePointsCardProps {
  amount: number;
  maxAmount: number;
  loading?: boolean;
  onCollectReward?: () => void;
}

export const ProfilePointsCard = (props: ProfilePointsCardProps) => {
  const {amount, loading, maxAmount, onCollectReward} = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignContent='center'
              alignItems='center'
              justifyContent='center'>
              <Box className={classes.relative}>
                <CustomBackgroundCircularProgress
                  disableShrink
                  size={theme.spacing(40)}
                  variant='determinate'
                  value={100}
                  style={{position: 'absolute', left: 0}}
                />
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'
                  style={{position: 'absolute', left: 0}}
                  height={theme.spacing(40)}
                  width={theme.spacing(40)}>
                  <Typography variant='h4'>
                    {loading ? <Skeleton width={theme.spacing(10)} /> : amount}
                  </Typography>
                </Box>
                <CustomCircularProgress
                  disableShrink
                  size={theme.spacing(40)}
                  variant={loading ? 'indeterminate' : 'determinate'}
                  value={
                    maxAmount === 0 || loading
                      ? undefined
                      : (amount / maxAmount) * 100
                  }
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' mb={2}>
              <Typography variant='body2'>Next reward</Typography>
              <Typography variant='body2'>
                {loading ? (
                  <Skeleton width={theme.spacing(8)} />
                ) : (
                  <>
                    {amount} of {maxAmount} points
                  </>
                )}
              </Typography>
            </Box>
            <ButtonBase
              onClick={onCollectReward}
              className={classes.collectRewardButton}
              component={Paper}
              variant='outlined'>
              <Box p={2}>
                <Grid
                  alignItems='center'
                  alignContent='center'
                  container
                  spacing={2}>
                  <Grid item>
                    <Box className={classes.collectRewardButtonIconSquare}>
                      <GiftIcon />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='body2'>Collect reward</Typography>
                  </Grid>
                  <Grid item>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'>
                      <NavigateNextIcon />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </ButtonBase>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfilePointsCard;
