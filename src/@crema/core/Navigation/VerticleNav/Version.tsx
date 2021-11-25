import React from 'react';
import {ListItem, ListItemText} from '@material-ui/core';
import clsx from 'clsx';
import {NavLink} from '../../../index';
import useStyles from './VerticalItem.style';
import {useHistory} from 'react-router';
import packageJson from '../../../../../package.json';

export const Version = () => {
  const history = useHistory();
  const onClick = () => {
    history.push('/changelog');
  };
  const level = 0;
  const classes = useStyles({level});
  return (
    <ListItem
      button
      onClick={onClick}
      component={NavLink}
      className={clsx(classes.navItem, 'nav-item')}>
      <ListItemText primary={`v${packageJson.version}`} classes={{primary: 'nav-item-text'}} />
    </ListItem>
  );
};
