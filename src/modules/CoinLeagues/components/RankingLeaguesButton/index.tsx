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
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {useToggler} from 'hooks/useToggler';
import {useMobile} from 'hooks/useMobile';
import CopyButton from 'shared/components/CopyButton';
import FileCopy from '@material-ui/icons/FileCopy';

import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import UserProfileItem from '../UserProfileItem';
import {GameProfile} from 'modules/CoinLeagues/utils/types';

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
}

export const RankingButton = (props: RankingButtonProps) => {
  const classes = useStyles();
  const {coinSymbol} = useLeaguesChainInfo();

  const {address, featured, position, label, count, profile} = props;

  const toggler = useToggler();

  // const handleClick = useCallback(() => {
  //   onClick(address);
  // }, [address, onClick]);

  const handleToggle = useCallback(() => {
    toggler.toggle();
  }, [toggler]);

  //const isMobile = useMobile();

  /* const formattedAddress = useMemo(() => {
    if (isMobile) {
      const name = GET_BITBOY_NAME(address);
      if (name) {
        return name.label;
      } else {
        return truncateAddress(address);
      }
    } else {
      const name = GET_BITBOY_NAME(address);
      if (name) {
        return name.label;
      } else {
        return address;
      }
    }
  }, [address, isMobile]);*/

  return (
    <Paper variant='outlined'>
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
        <Box p={4} display={'flex'}>
          <Grid container>
            <Grid item>
              <CopyButton
                size='small'
                copyText={address || ''}
                tooltip='Copied!'>
                <FileCopy color='inherit' style={{fontSize: 16}} />
              </CopyButton>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Wins: {props?.winsCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                First Place: {props?.firstCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Second Place: {props?.secondCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Third Place: {props?.thirdCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Joins: {props?.joinsCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Wins/Joins:{' '}
                {props?.joinsCount
                  ? `${Number(
                      ((props?.winsCount || 0) / props?.joinsCount) * 100,
                    ).toFixed(2)} %`
                  : '0%'}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                Earned {coinSymbol}: {props?.totalEarned}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'} className={classes.paragraphMargin}>
                {coinSymbol} Profit: {props?.EarnedMinusSpent}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RankingButton;
