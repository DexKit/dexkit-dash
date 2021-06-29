import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LanguageSwitcher from '../../LanguageSwitcher';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppHeader.style';
import HeaderMessages from '../../HeaderMessages';
import Notifications from '../../Notifications';

import WalletInfo from 'shared/components/WalletInfo';
import { ChainId } from 'types/blockchain';
import { useWeb3 } from 'hooks/useWeb3';
import { GET_CHAIN_ID_NAME } from 'shared/constants/Blockchain';
import ThemeModeSwitcher from '@crema/core/ThemeModeSwitcher';



import clsx from 'clsx';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const {chainId} = useWeb3();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem className={classes.menuItemRoot}>
        <HeaderMessages />
      </MenuItem>
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
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
            onClick={() => dispatch(toggleNavCollapsed())}>
            <MenuIcon className={classes.menuIcon} />
          </IconButton>

         {/* <AppLogo />*/}
         <Box className={classes.grow} />
          {/* <SearchBar borderLight placeholder='Search…' />*/}
          <Box className={classes.sectionDesktop}>
          {/*<Hidden mdDown >
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='open drawer'
              onClick={onChangeNavStyle}>
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          </Hidden> */}
            <LanguageSwitcher />
            <ThemeModeSwitcher />
          {/*  <HeaderMessages />*/}
            <Notifications />
            {
              (chainId !== ChainId.Mainnet && chainId !== undefined) ? (
                <Box
                  className={classes.badgeRoot}
                  style={{
                    color: 'rgba(226, 167, 46)',
                    backgroundColor: 'rgba(226, 167, 46, 0.267)',
                  }}>
                  {GET_CHAIN_ID_NAME(chainId)}
                </Box>
              ) : null
            }
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
          <Box className={classes.wallet}>
            <WalletInfo />
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;

