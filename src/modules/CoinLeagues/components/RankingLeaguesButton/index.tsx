import React, {useCallback, useMemo} from 'react';

import {
  Box,
  Avatar,
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
  Paper,
  ButtonBase,
  Chip,
  Collapse,
  Divider,
  makeStyles,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {useToggler} from 'hooks/useToggler';
import {useMobile} from 'hooks/useMobile';
import {truncateAddress} from 'utils';
import CopyButton from 'shared/components/CopyButton';
import FileCopy from '@material-ui/icons/FileCopy';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';

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
  src?: string;
  count?: number;
  joinsCount?: number;
  winsCount?: number;
  firstCount?: number;
  secondCount?: number;
  thirdCount?: number;
  label: string;
  featured?: boolean;
}

export const RankingButton = (props: RankingButtonProps) => {
  const classes = useStyles();

  const {address, onClick, src, featured, position, label, count, winsCount} =
    props;

  const toggler = useToggler();

  const handleClick = useCallback(() => {
    onClick(address);
  }, [address, onClick]);

  const handleToggle = useCallback(() => {
    toggler.toggle();
  }, []);

  const isMobile = useMobile();

  const formattedAddress = useMemo(() => {
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
  }, [address, isMobile]);

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
              <Typography align='left' variant='body1'>
                {formattedAddress}
              </Typography>
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
          <CopyButton size='small' copyText={address || ''} tooltip='Copied!'>
            <FileCopy color='inherit' style={{fontSize: 16}} />
          </CopyButton>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            Wins: {props?.winsCount}
          </Typography>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            First Place: {props?.firstCount}
          </Typography>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            Second Place: {props?.secondCount}
          </Typography>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            Third Place: {props?.thirdCount}
          </Typography>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            Joins: {props?.joinsCount}
          </Typography>

          <Typography variant={'body1'} className={classes.paragraphMargin}>
            Wins/Joins:{' '}
            {props?.joinsCount
              ? `${Number(
                  ((props?.winsCount || 0) / props?.joinsCount) * 100,
                ).toFixed(2)} %`
              : '0%'}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RankingButton;
