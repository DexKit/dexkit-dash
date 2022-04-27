import React, {useCallback} from 'react';
import {
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';

import clsx from 'clsx';
import {Link as RouterLink} from 'react-router-dom';

import Box from '@material-ui/core/Box';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import {NavItemProps} from '../../../../modules/routesConfig';
import {
  RouteComponentProps,
  useLocation,
  withRouter,
  useHistory,
} from 'react-router-dom';
import CustomIcon from 'shared/components/CustomIcon';
import {useDispatch} from 'react-redux';
import {toggleNavCollapsed} from 'redux/actions';
import {useMobile} from 'hooks/useMobile';

import {ReactComponent as ArrowRightIcon} from 'assets/images/arrow-right.svg';

interface VerticalItemProps extends RouteComponentProps<any> {
  item: NavItemProps;
  level: number;
}

const VerticalItem: React.FC<VerticalItemProps> = ({item, level}) => {
  const classes = useStyles({level});
  const location = useLocation();
  const history = useHistory();

  const getUrl = useCallback(() => {
    if (item.url) return item.url;
    return '/';
  }, [item.url]);
  const isActive = () => {
    if (item.url === location.pathname) {
      return true;
    }
    //TODO: special case for the Wallet path
    if (item.url && location.pathname) {
      // parsing the url's here
      const parsedPath = item.url.split('/').filter((e) => e);
      const currentPath = location.pathname.split('/').filter((e) => e);
      if (
        currentPath.length > 1 &&
        currentPath[0] === 'wallet' &&
        parsedPath.length > 0 &&
        parsedPath[0] === 'wallet'
      ) {
        return true;
      }
    }

    //TODO: special case for the Explorer path
    if (item.url && location.pathname) {
      // parsing the url's here
      const parsedPath = item.url.split('/').filter((e) => e);
      const currentPath = location.pathname.split('/').filter((e) => e);
      if (
        currentPath.length > 1 &&
        currentPath[0] === 'explorer' &&
        parsedPath.length > 0 &&
        parsedPath[0] === 'explorer'
      ) {
        return true;
      }
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

  const isMobile = useMobile();
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (isMobile) {
      dispatch(toggleNavCollapsed());
    }
  }, [dispatch, isMobile]);

  const handleClickIconButton = useCallback(() => {
    if (isMobile) {
      dispatch(toggleNavCollapsed());
    }
    history.push(getUrl());
  }, [dispatch, isMobile, history, getUrl]);

  return (
    <>
      <ListItem
        component={RouterLink}
        to={getUrl()}
        selected={isActive()}
        button
        onClick={handleClick}>
        {item.icon && (
          <ListItemIcon>
            <Box className={classes.itemIcon}>
              {item.customIcon ? (
                <CustomIcon icon={item.icon as string} />
              ) : (
                <Icon>{item.icon}</Icon>
              )}
            </Box>
          </ListItemIcon>
        )}
        <ListItemText
          className={clsx(classes.listItemText, 'visible-hover')}
          primary={<IntlMessages id={item.messageId} />}
        />
        <ListItemSecondaryAction className='visible-hover'>
          <IconButton onClick={handleClickIconButton}>
            <ArrowRightIcon className={classes.arrowIcon} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider className={clsx(classes.divider, 'visible-hover')} />
    </>
  );
};

export default withRouter(VerticalItem);
