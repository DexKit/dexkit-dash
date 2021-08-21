import {InputAdornment} from '@material-ui/core';
import React, {FC} from 'react';
import {
  InfoButtonComponent,
  PopOverProps,
} from 'shared/components/ActionsButtons/infoButtonComponent';

interface Props {
  text?: string;
}
export const InfoComponent: FC<Props> = (props) => (
  <InputAdornment position='end'>
    <InfoButtonComponent
      popoverProps={
        {
          anchorReference: 'anchorEl',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        } as PopOverProps
      }
      text={props.text}
    />
  </InputAdornment>
);
