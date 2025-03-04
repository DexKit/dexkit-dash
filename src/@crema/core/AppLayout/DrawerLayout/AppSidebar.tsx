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
  return (
    <Drawer
      anchor={position}
      open={navCollapsed}
      onClose={() => handleToggleDrawer()}
      style={{position: 'absolute'}}>
      <Box height='100%' className={classes.drawerContainer}>
        <Box
          height='100%'
          width='100%'
          color='primary.contrastText'
          className={classes.sidebarBg}>
          <UserInfo />
          <PerfectScrollbar className={classes.drawerScrollAppSidebar}>
            <Navigation />
          </PerfectScrollbar>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AppSidebar;
