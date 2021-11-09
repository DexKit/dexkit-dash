import React from 'react';
import {ListItem, ListItemText} from '@material-ui/core';
import clsx from 'clsx';
import {NavLink} from '../../../index';
import useStyles from './VerticalItem.style';

export const DexKitPowered = () => {
  const onClick = () => {
    window.open('https://dexkit.com')
  };
  const level = 0;
  const classes = useStyles({level});
  return (
    <ListItem
      button
      onClick={onClick}
      component={NavLink}
      className={clsx(classes.navItem, 'nav-item')}>
      <ListItemText primary={'Powered By DexKit'} classes={{primary: 'nav-item-text'}} />
    </ListItem>
  );
};
