import React, {useCallback} from 'react';

import {
  Box,
  Avatar,
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
import {truncateAddress} from 'utils';

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
}));

interface RankingButtonProps {
  onClick: (address: string) => void;
  address: string;
  position: number;
  src?: string;
  featured?: boolean;
}

export const RankingButton = (props: RankingButtonProps) => {
  const classes = useStyles();

  const {address,  src, featured, position} = props;

  const toggler = useToggler();

  // const handleClick = useCallback(() => {
  //   onClick(address);
  // }, [address, onClick]);

  const handleToggle = useCallback(() => {
    toggler.toggle();
  }, [toggler]);

  const isMobile = useMobile();

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
                {isMobile ? truncateAddress(address) : address}
              </Typography>
            </Grid>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {src ? (
                  <Avatar src={src} className={classes.avatar} />
                ) : (
                  <Skeleton className={classes.avatar} variant='circle' />
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
        <Box p={4}></Box>
      </Collapse>
    </Paper>
  );
};

export default RankingButton;
