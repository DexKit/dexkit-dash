import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Drawer from '@material-ui/core/Drawer';
import UserInfo from '../../../../shared/components/UserInfo';
import Navigation from '../../Navigation/VerticleNav';
import {toggleNavCollapsed} from '../../../../redux/_settings/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppSidebar.style';
import {AppState} from '../../../../redux/store';
import {Hidden} from '@material-ui/core';
import clsx from 'clsx';
import AppLogo from 'shared/components/AppLogo';

interface AppSidebarProps {
  position?: 'left' | 'bottom' | 'right' | 'top' | undefined;
}

const AppSidebar: React.FC<AppSidebarProps> = ({position = 'left'}) => {
  const dispatch = useDispatch();
  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  const handleToggleDrawer = () => {
    dispatch(toggleNavCollapsed());
  };

  const classes = useStyles();
  const sidebarClasses = classes.sidebarStandard;

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor={position}
          open={navCollapsed}
          onClose={() => handleToggleDrawer()}
          style={{position: 'absolute'}}>
          <Box height='100%' className={classes.miniSidebar}>
            <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
              <Box
                style={{display: 'flex'}}
                justifyContent='center'
                alignContent='center'>
                <AppLogo
                  justifyContent='center'
                  logo={require('assets/images/logo_white_kit.png')}
                />
              </Box>

              {/*  <UserInfo />*/}

              <Box />

              <PerfectScrollbar className={classes.drawerScrollAppSidebar}>
                <Navigation />
              </PerfectScrollbar>
            </Box>
          </Box>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Box height='100%' className={clsx(classes.miniSidebar, 'app-sidebar')}>
          <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
            {/*   <UserInfo />*/}

            <AppLogo
              justifyContent='center'
              logo={require('assets/images/logo_white_kit.png')}
            />

            <AppLogo
              justifyContent='center'
              logo={require('assets/images/dexkit_logo.png')}
            />

            <PerfectScrollbar className={classes.scrollAppSidebar}>
              <Navigation />
            </PerfectScrollbar>
          </Box>
        </Box>
      </Hidden>
    </>
  );
};

export default AppSidebar;
