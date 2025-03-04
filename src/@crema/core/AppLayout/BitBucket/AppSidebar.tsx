import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import UserInfo from '../../../../shared/components/UserInfo';
import Navigation from '../../Navigation/VerticleNav';
import {toggleNavCollapsed} from '../../../../redux/_settings/actions';
import {useDispatch, useSelector} from 'react-redux';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import BucketMinibar from './BucketMinibar';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useStyles from './AppSidebar.style';
import {AppState} from '../../../../redux/store';

interface AppSidebarProps {
  isCollapsed: boolean;
  variant?: string;
  position?: 'left' | 'bottom' | 'right' | 'top' | undefined;
  setCollapsed: (isCollapsed: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const {isCollapsed, setCollapsed, position = 'left'} = props;

  const dispatch = useDispatch();
  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  const handleToggleDrawer = () => {
    dispatch(toggleNavCollapsed());
  };
  const classes = useStyles(props);

  const sidebarClasses = classes.sidebarStandard;

  const sideBarComponent = () => {
    return (
      <Box className={clsx(classes.bitBucketSidebar, 'bit-bucket-sidebar')}>
        <Box
          className={classes.bitBucketBtn}
          onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
        </Box>
        <BucketMinibar />
        <Box className={`app-sidebar-container ${classes.appSidebarContainer}`}>
          <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
            <UserInfo />
            <PerfectScrollbar className={classes.drawerScrollAppSidebar}>
              <Navigation />
            </PerfectScrollbar>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor={position}
          open={navCollapsed}
          onClose={() => handleToggleDrawer()}
          style={{position: 'absolute'}}>
          {sideBarComponent()}
        </Drawer>
      </Hidden>
      <Hidden mdDown>{sideBarComponent()}</Hidden>
    </>
  );
};
export default AppSidebar;
