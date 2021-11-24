import React from 'react';
import {ListItem, ListItemText} from '@material-ui/core';
import clsx from 'clsx';
import {NavLink} from '../../../index';
import useStyles from './VerticalItem.style';
import packageJson from '../../../../../package.json';

export const Version = () => {

  const level = 0;
  const classes = useStyles({level});
  return (
    <ListItem
      component={NavLink}
      className={clsx(classes.navItem, 'nav-item')}>
      <ListItemText primary={`v${packageJson.version}`} classes={{primary: 'nav-item-text'}} />
    </ListItem>
  );
};
