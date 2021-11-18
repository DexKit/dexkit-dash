import React from 'react';
import {ListItem, ListItemText} from '@material-ui/core';
import clsx from 'clsx';
import {NavLink} from '../../../index';
import useStyles from './VerticalItem.style';
import {useHistory} from 'react-router';

export const Version = () => {

  const level = 0;
  const classes = useStyles({level});
  return (
    <ListItem
      component={NavLink}
      className={clsx(classes.navItem, 'nav-item')}>
      <ListItemText primary={'v0.0.3-2'} classes={{primary: 'nav-item-text'}} />
    </ListItem>
  );
};
