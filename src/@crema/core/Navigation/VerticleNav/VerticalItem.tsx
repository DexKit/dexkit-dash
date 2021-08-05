import React from 'react';
import {Icon, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';

import {Badge, NavLink} from '../../../index';
import Box from '@material-ui/core/Box';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import {NavItemProps} from '../../../../modules/routesConfig';
import {RouteComponentProps, useLocation, withRouter} from 'react-router-dom';
import CustomIcon from 'shared/components/CustomIcon';

interface VerticalItemProps extends RouteComponentProps<any> {
  item: NavItemProps;
  level: number;
}

const VerticalItem: React.FC<VerticalItemProps> = ({
  item,
  match,
  history,
  level,
}) => {
  const classes = useStyles({level});
  const location = useLocation();

  const getUrl = () => {
    if (item.url) return item.url;
    return '/';
  };
  const isActive = () => {
    if (item.url === location.pathname) {
      return true;
    }
    if (item.url && location.pathname) {
      // parsing the url's here
      const parsedPath = item.url.split('/').filter((e) => e);
      const currentPath = location.pathname.split('/').filter((e) => e);
      let counter = 0;
      parsedPath.forEach((p) => {
        if (currentPath.includes(p)) {
          counter = counter + 1;
        }
      });
      // NOTE: We are assuming that if field have at least 2 match's we can consider it activate
      if (counter > 1) {
        return true;
      }
    }
    return false;
  };

  return (
    <ListItem
      className={classes.item}
      selected={isActive()}
      button
      to={getUrl()}
      component={NavLink}>
      {item.icon && (
        <ListItemIcon className={classes.itemIcon}>
          {item.customIcon ? (
            <CustomIcon
              icon={item.icon as string}
              className={isActive() ? classes.svgActive : undefined}
            />
          ) : (
            <Icon>{item.icon}</Icon>
          )}
        </ListItemIcon>
      )}
      <ListItemText
        className={classes.listItemText}
        primary={<IntlMessages id={item.messageId} />}
      />
      {item.count && (
        <Box mr={4} clone>
          <Badge count={item.count} color={item.color} />
        </Box>
      )}
    </ListItem>
  );
};

export default withRouter(VerticalItem);
