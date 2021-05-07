import React from 'react';
import {Icon, Link, ListItemText } from '@material-ui/core';
import clsx from 'clsx';
import {Badge} from '../../../index';
import Box from '@material-ui/core/Box';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalItem.style';
import { NavItemProps } from '../../../../modules/routesConfig';


interface VerticalExternalProps{
  item: NavItemProps;
  level: number;
}

const VerticalExternal: React.FC<VerticalExternalProps> = ({
  item,
  level,
}) => {
  const classes = useStyles({level});

  const getUrl = () => {
    if (item.url) return item.url;
    return '/';
  };
  
  return (
    <Link
      href={getUrl()}
      target={'_blank'}
      style={{'display':'flex'}}
      className={clsx(classes.navItem, 'nav-item')}>
      {item.icon && (
        <Box component='span' mr={6}>
          <Icon
            className={clsx(classes.listIcon, 'nav-item-icon')}
            color='action'>
            {item.icon}
          </Icon>
        </Box>
      )} 
      <ListItemText
        primary={<IntlMessages id={item.messageId} />}
        classes={{primary: 'nav-item-text'}}
      />
      <Box component='span' mr={6} className={'nav-item-text'}>
          <Icon
            className={clsx(classes.listIcon, 'nav-item-icon')}
            color='action'>
           open_in_new
          </Icon>
        </Box>
     {/*  <IntlMessages classes={{primary: 'nav-item-text'}} id={item.messageId} />*/}
     {/* <ListItemText
        primary={ }
        classes={{primary: 'nav-item-text'}}
     />*/}
      {item.count && (
        <Box mr={4} clone >
          <Badge count={item.count} color={item.color} />
        </Box>
      )}
    </Link>
  );
};

export default VerticalExternal;
