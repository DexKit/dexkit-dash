import React, {useCallback} from 'react';
import {
  Icon,
  Link,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import clsx from 'clsx';
import {Badge} from '../../../index';
import Box from '@material-ui/core/Box';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import {NavItemProps} from '../../../../modules/routesConfig';

interface VerticalExternalProps {
  item: NavItemProps;
  level: number;
}

const VerticalExternal: React.FC<VerticalExternalProps> = ({item, level}) => {
  const classes = useStyles({level});

  const getUrl = () => {
    if (item.url) return item.url;
    return '/';
  };

  const handleOpenLink = useCallback(() => {
    window.open(getUrl(), '_blank');
  }, [getUrl]);

  return (
    <ListItem button onClick={handleOpenLink} className={classes.item}>
      {item.icon && (
        <ListItemIcon className={clsx(classes.itemIcon, 'visible-hover')}>
          <Icon
            className={clsx(classes.listIcon, 'nav-item-icon')}
            color='action'>
            {item.icon}
          </Icon>
        </ListItemIcon>
      )}
      <ListItemText
        primary={<IntlMessages id={item.messageId} />}
        classes={{primary: 'nav-item-text'}}
      />
      <ListItemSecondaryAction
        className={clsx(classes.hiddenOverflow, 'nav-item-icon-arrow')}>
        <Icon color='action'>open_in_new</Icon>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VerticalExternal;
