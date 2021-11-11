import React from 'react';

import {IconButtonProps} from '@material-ui/core';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

import {FastFoodOutlineIcon} from 'shared/components/Icons';

interface FeedKittygotchiButtonProps extends IconButtonProps {}

export const FeedKittygotchiButton = (props: FeedKittygotchiButtonProps) => {
  return (
    <RoundedIconButton {...props}>
      <FastFoodOutlineIcon stroke='white' />
    </RoundedIconButton>
  );
};

export default FeedKittygotchiButton;
