import React, {useCallback} from 'react';
import {
  Icon,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Box,
} from '@material-ui/core';
import clsx from 'clsx';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import {NavItemProps} from '../../../../modules/routesConfig';

import {ReactComponent as ExportIcon} from 'assets/images/export.svg';

interface VerticalExternalProps {
  item: NavItemProps;
  level: number;
}

const VerticalExternal: React.FC<VerticalExternalProps> = ({item, level}) => {
  const classes = useStyles({level});

  /* eslint-disable */
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
        <ListItemIcon>
          <Box className={clsx(classes.itemIcon, 'visible-hover')}>
            <Icon color='action'>{item.icon}</Icon>
          </Box>
        </ListItemIcon>
      )}
      <ListItemText
        primaryTypographyProps={{color: 'primary'}}
        primary={<IntlMessages id={item.messageId} />}
        classes={{primary: 'nav-item-text'}}
      />
      <ListItemSecondaryAction
        className={clsx(classes.hiddenOverflow, 'nav-item-icon-arrow')}>
        <ExportIcon />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VerticalExternal;
