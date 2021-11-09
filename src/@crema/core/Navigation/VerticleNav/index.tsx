import React from 'react';
import List from '@material-ui/core/List';

// import routesConfig from '../../../../modules/routesConfig';
import VerticalCollapse from './VerticalCollapse';
import {DexKitPowered} from './DexKit';
import VerticalItem from './VerticalItem';
import VerticalNavGroup from './VerticalNavGroup';
import VerticalExternal from './VerticaIExternal';
import useRoutesConfig from '../../../../modules/routesConfig';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const items = useRoutesConfig();

  return (
    <List disablePadding>
      {/*<AppLogo justifyContent="center" logo={require('assets/images/logo_white.png')}/>*/}
      {items.map((item, id) => (
        <React.Fragment key={id}>
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
     < DexKitPowered />
    {/*  <Version />*/}
    </List>
  );
};

export default Navigation;
