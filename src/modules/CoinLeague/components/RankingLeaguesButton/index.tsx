import React, {useCallback} from 'react';

import {
  Box,
  Grid,
  Typography,
  Paper,
  ButtonBase,
  Chip,
  Collapse,
  Divider,
  makeStyles,
  useTheme,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {useToggler} from 'hooks/useToggler';

import UserProfileItem from '../UserProfileItem';
import {GameProfile} from 'modules/CoinLeague/utils/types';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    width: '100%',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  paragraphMargin: {
    marginLeft: theme.spacing(4),
  },
}));

interface RankingButtonProps {
  onClick: (address: string) => void;
  address: string;
  position: number;
  profile?: GameProfile;
  src?: string;
  count?: number;
  joinsCount?: number;
  winsCount?: number;
  firstCount?: number;
  secondCount?: number;
  thirdCount?: number;
  totalEarned?: number;
  EarnedMinusSpent?: number;
  label: string;
  featured?: boolean;
  coinSymbol: string;
}

export const RankingButton = (props: RankingButtonProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const {address, featured, position, label, count, profile, coinSymbol} =
    props;

  const toggler = useToggler();

  // const handleClick = useCallback(() => {
  //   onClick(address);
  // }, [address, onClick]);

  const handleToggle = useCallback(() => {
    toggler.toggle();
  }, [toggler]);

  return (
    <Paper
      variant='outlined'
      style={featured ? {borderColor: theme.palette.primary.main} : undefined}>
      <ButtonBase onClick={handleToggle} className={classes.button}>
        <Box p={4}>
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'
            spacing={2}>
            <Grid item>
              <Chip
                color={featured ? 'primary' : 'default'}
                label={position}
                size='small'
              />
            </Grid>
            <Grid item xs>
              <Box
                display='flex'
                alignItems='left'
                alignContent='left'
                justifyContent='left'>
                <UserProfileItem address={address} profile={profile} />
              </Box>
            </Grid>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {!!count ? (
                  <Typography variant={'body1'}>
                    {label} {count || 0}
                  </Typography>
                ) : (
                  <Skeleton className={classes.avatar} variant='rect' />
                )}
              </Box>
            </Grid>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {toggler.show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ButtonBase>
      <Collapse in={toggler.show}>
        <Divider />
        <Box p={4} display='flex'>
          <Grid container spacing={4}>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                Wins
              </Typography>
              <Typography variant='subtitle1'>{props?.winsCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages
                  id='coinLeague.firstPlace'
                  defaultMessage='First Place'
                />
              </Typography>
              <Typography variant='subtitle1'>{props?.firstCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages
                  id='coinLeague.secondPlace'
                  defaultMessage='Second Place'
                />
              </Typography>
              <Typography variant='subtitle1'>{props?.secondCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages
                  id='coinLeague.thirdPlace'
                  defaultMessage='Third Place'
                />
              </Typography>
              <Typography variant='subtitle1'>{props?.thirdCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages id='coinLeague.joins' defaultMessage='Joins' />
              </Typography>
              <Typography variant='subtitle1'>{props?.joinsCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages
                  id='coinLeague.winsAndJoins'
                  defaultMessage='Wins/Joins'
                />
              </Typography>
              <Typography variant='subtitle1'>
                {props?.joinsCount
                  ? `${Number(
                      ((props?.winsCount || 0) / props?.joinsCount) * 100,
                    ).toFixed(2)}%`
                  : '0%'}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary' gutterBottom>
                <IntlMessages
                  id='coinLeague.totalEarned'
                  defaultMessage='Total Earned'
                />
              </Typography>
              <Typography variant='subtitle1'>
                {props?.totalEarned} {coinSymbol}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='caption' color='textSecondary'>
                <IntlMessages id='coinLeague.profit' defaultMessage='Profit' />
              </Typography>
              <Typography variant='subtitle1'>
                {props?.EarnedMinusSpent} {coinSymbol}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RankingButton;
