import React from 'react';
import {withStyles, ButtonBase, styled} from '@material-ui/core';

export const AppBarButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#2F3142',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}))(ButtonBase);

export default AppBarButton;
