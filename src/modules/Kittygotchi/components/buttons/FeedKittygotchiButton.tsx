import React from 'react';

import {
  CircularProgress,
  makeStyles,
  useTheme,
  IconButtonProps,
} from '@material-ui/core';

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

interface FeedKittygotchiButtonProps extends IconButtonProps {}

export const FeedKittygotchiButton = (props: FeedKittygotchiButtonProps) => {
  const {onClick, disabled} = props;
  const classes = useStyles();

  const theme = useTheme();

  return (
    <RoundedIconButton {...props}>
      <FastFoodOutlineIcon stroke='white' />
    </RoundedIconButton>
  );
};

export default FeedKittygotchiButton;
