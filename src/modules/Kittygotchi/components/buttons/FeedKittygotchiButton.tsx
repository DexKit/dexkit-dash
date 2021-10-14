import React from 'react';

import {CircularProgress, makeStyles, useTheme} from '@material-ui/core';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

import {
  EditIcon,
  FastFoodOutlineIcon,
  FlashIcon,
  FlashOutlinedIcon,
  GiftIcon,
  ShareIcon,
  ShieldOutlinedIcon,
} from 'shared/components/Icons';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: 0,
    fontSize: 50,
  },
}));

interface FeedKittygotchiButtonProps {
  onClick?: () => void;
}

export const FeedKittygotchiButton = (props: FeedKittygotchiButtonProps) => {
  const {onClick} = props;
  const classes = useStyles();

  const theme = useTheme();

  return (
    <div className={classes.buttonWrapper}>
      <RoundedIconButton onClick={onClick}>
        <FastFoodOutlineIcon stroke='white' />
      </RoundedIconButton>
      {/* <CircularProgress
        className={classes.progress}
        variant='determinate'
        value={50}
      /> */}
    </div>
  );
};

export default FeedKittygotchiButton;
