import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LanguageSwitcher from '../../LanguageSwitcher';
import {toggleNavCollapsed} from '../../../../redux/_settings/actions';
import {useDispatch} from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
// import SearchBar from '../../SearchBar';
import useStyles from './AppHeader.style';
// import HeaderMessages from '../../HeaderMessages';
import Notifications from '../../Notifications';
import AppLogo from '../../../../shared/components/AppLogo';
import HeaderUser from '../../../../shared/components/HeaderUser';
import clsx from 'clsx';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = useState<null | HTMLElement>(null);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}>
      {/* <MenuItem className={classes.menuItemRoot}>
        <HeaderMessages />
      </MenuItem> */}
      <MenuItem className={classes.menuItemRoot}>
        <Notifications />
      </MenuItem>
      <LanguageSwitcher />
    </Menu>
  );

  return (
    <>
      <AppBar color='inherit' className={clsx(classes.appBar, 'app-bar')}>
        <Toolbar className={classes.appToolbar}>
          <Hidden lgUp>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='open drawer'
              onClick={() => dispatch(toggleNavCollapsed())}>
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          </Hidden>
          <AppLogo />
          <Box className={classes.grow} />
          {/* <SearchBar borderLight placeholder='Search…' /> */}
          <Box className={classes.sectionDesktop}>
            <LanguageSwitcher />
            {/* <HeaderMessages /> */}
            <Notifications />
          </Box>
          <Box className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'>
              <MoreIcon />
            </IconButton>
          </Box>

          <HeaderUser />
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;
