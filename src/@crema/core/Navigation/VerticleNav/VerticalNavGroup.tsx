import React from 'react';
import {ListItem, ListSubheader, Divider} from '@material-ui/core';
import clsx from 'clsx';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import IntlMessages from '../../../utility/IntlMessages';
import useStyles from './VerticalNavGroup.style';
import {NavItemProps} from '../../../../modules/routesConfig';
import VerticalExternal from './VerticaIExternal';
import {AppState} from 'redux/store';
import {useSelector} from 'react-redux';

interface VerticalNavGroupProps {
  item: NavItemProps;
  level: number;
}

const VerticalNavGroup: React.FC<VerticalNavGroupProps> = ({item, level}) => {
  const classes = useStyles({level});

  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  return (
    <>
      {!navCollapsed ? (
        <>
          <ListSubheader
            disableSticky
            component='li'
            className={classes.subheader}>
            {<IntlMessages id={item.messageId} />}
          </ListSubheader>
          <Divider className={classes.divider} />
        </>
      ) : null}
      {item.children && Array.isArray(item.children) && (
        <>
          {item.children.map((item: any) => (
            <React.Fragment key={item.id}>
              {item.type === 'group' && (
                <NavVerticalGroup item={item} level={level} />
              )}

              {item.type === 'collapse' && (
                <VerticalCollapse item={item} level={level} />
              )}

              {item.type === 'item' && (
                <VerticalItem item={item} level={level} />
              )}
              {item.type === 'external' && (
                <VerticalExternal item={item} level={level} />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};

const NavVerticalGroup = VerticalNavGroup;

export default NavVerticalGroup;
