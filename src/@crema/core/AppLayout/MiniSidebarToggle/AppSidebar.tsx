import React, {useContext} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import clsx from 'clsx';
import Navigation from '../../Navigation/VerticleNav';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppSidebar.style';
import Scrollbar from '../../Scrollbar';
import AppContext from '../../../utility/AppContext';
import AppContextPropsType from '../../../../types/AppContextPropsType';
import {AppState} from '../../../../redux/store';
import {Skeleton} from '@material-ui/lab';

import {
  Grid,
  IconButton,
  Divider,
  ButtonBase,
  Avatar,
  Typography,
  Link,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';

import MenuIcon from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import {useProfileKittygotchi} from 'modules/Profile/hooks';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {truncateAddress} from 'utils';

interface AppSidebarProps {
  variant?: string;
  position?: 'left' | 'bottom' | 'right' | 'top';
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  position = 'left',
  variant,
}) => {
  const dispatch = useDispatch();
  const {themeMode} = useContext<AppContextPropsType>(AppContext);
  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  const handleToggleDrawer = () => {
    dispatch(toggleNavCollapsed());
  };

  const classes = useStyles({themeMode});
  const sidebarClasses = classes.sidebarStandard;

  const kittygotchiProfile = useProfileKittygotchi();

  const defaultAddress = useDefaultAccount();

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor={position}
          open={navCollapsed}
          onClose={handleToggleDrawer}
          classes={{
            paper: classes.drawer,
          }}
          style={{position: 'absolute'}}>
          <Box height='100%'>
            <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
              <Box p={4}>
                <Grid
                  container
                  spacing={2}
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Grid item>
                    <Box p={2}>
                      <Grid
                        container
                        alignItems='center'
                        alignContent='center'
                        spacing={4}>
                        <Grid item>
                          <ButtonBase
                            className={classes.avatarButton}
                            to='/profile'
                            component={RouterLink}>
                            <Avatar
                              className={classes.avatar}
                              src={kittygotchiProfile.kittygotchi?.image}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item>
                          <Typography variant='body1'>
                            {defaultAddress ? (
                              truncateAddress(defaultAddress)
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                          <Typography color='textSecondary' variant='body2'>
                            {defaultAddress ? (
                              <Link
                                onClick={handleToggleDrawer}
                                component={RouterLink}
                                to='/profile'>
                                View profile
                              </Link>
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'
                      justifyContent='center'>
                      <IconButton onClick={handleToggleDrawer}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Scrollbar className={classes.drawerScrollAppSidebar}>
                <Navigation />
              </Scrollbar>
            </Box>
          </Box>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Box
          height='100%'
          className={clsx(
            classes.container,
            'app-sidebar',
            !navCollapsed ? '' : 'mini-sidebar-collapsed',
          )}>
          <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
            <Box p={4}>
              <IconButton onClick={() => dispatch(toggleNavCollapsed())}>
                {navCollapsed ? <MenuIcon /> : <Close />}
              </IconButton>
            </Box>
            <Divider />
            <Scrollbar className={classes.scrollAppSidebar}>
              <Navigation />
              {/* <Box p={4} className='visible-hover'>
                <Paper>
                  <Box p={4}>
                    <Grid
                      spacing={4}
                      container
                      direction='column'
                      justify='center'
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <SupportImage />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography align='center' variant='h5'>
                          Doubts?
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography align='center' variant='body1'>
                          Do you have any questions? Please, contact our
                          support.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          color='primary'
                          startIcon={<TwoFourSupportIcon />}
                          variant='contained'
                          size='large'>
                          Support
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box> */}
            </Scrollbar>
          </Box>
        </Box>
      </Hidden>
    </>
  );
};

export default AppSidebar;
