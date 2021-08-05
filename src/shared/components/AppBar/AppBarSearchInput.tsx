import React from 'react';
import {withStyles, InputBase} from '@material-ui/core';

export const AppBarSearchInput = withStyles((theme) => ({
  root: {
    backgroundColor: '#252836',
    border: 'none !important;',
    color: '#7A8398',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontStyle: 'normal',
  },
}))(InputBase);

export default AppBarSearchInput;
