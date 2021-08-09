import React from 'react';
import List from '@material-ui/core/List';

// import routesConfig from '../../../../modules/routesConfig';
import VerticalCollapse from './VerticalCollapse';
import {Version} from './Version';
import VerticalItem from './VerticalItem';
import VerticalNavGroup from './VerticalNavGroup';
import VerticalExternal from './VerticaIExternal';
import useRoutesConfig from '../../../../modules/routesConfig';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const items = useRoutesConfig();

  return (
    <List>
      {/*<AppLogo justifyContent="center" logo={require('assets/images/logo_white.png')}/>*/}
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {item.type === 'group' && <VerticalNavGroup item={item} level={0} />}

          {item.type === 'collapse' && (
            <VerticalCollapse item={item} level={0} />
          )}

          {item.type === 'item' && <VerticalItem item={item} level={0} />}

          {item.type === 'external' && (
            <VerticalExternal item={item} level={0} />
          )}
        </React.Fragment>
      ))}
      <Version />
    </List>
  );
};

export default Navigation;
