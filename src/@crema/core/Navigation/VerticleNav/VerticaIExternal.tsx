import React, {useCallback} from 'react';
import {
  Icon,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import clsx from 'clsx';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import {NavItemProps} from '../../../../modules/routesConfig';
import CustomIcon from 'shared/components/CustomIcon';
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
          {item.customIcon ? (
            <CustomIcon
              icon={item.icon as string}
              className={undefined}
            />
          ) : (
            <Icon className={clsx(classes.listIcon, 'nav-item-icon')}  color='action'>{item.icon}</Icon>
          )}
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
