import React, {useContext, useState} from 'react';
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
// import AppLogo from '../../../../shared/components/AppLogo';
import clsx from 'clsx';
import WalletInfo from 'shared/components/WalletInfo';
import {ChainId} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {GET_CHAIN_ID_NAME} from 'shared/constants/Blockchain';
import AppContextPropsType from 'types/AppContextPropsType';
import {AppContext} from '@crema';
import {NavStyle} from 'shared/constants/AppEnums';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {navStyle, changeNavStyle} = useContext<AppContextPropsType>(
    AppContext,
  );

  const {chainId} = useWeb3();

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
  const onChangeNavStyle = () => {
    if (navStyle === NavStyle.MINI && changeNavStyle) {
      changeNavStyle(NavStyle.STANDARD);
    } else if (changeNavStyle) {
      changeNavStyle(NavStyle.MINI);
    } else {
      console.log('no nav style');
    }
  };

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

          <Hidden mdDown>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='open drawer'
              onClick={onChangeNavStyle}>
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          </Hidden>

          {/* <AppLogo /> */}

          <Box className={classes.grow} />

          {/* <SearchBar borderLight placeholder='Search…' /> */}

          <Box className={classes.sectionDesktop}>
            {chainId !== ChainId.Mainnet && chainId !== undefined ? (
              <Box
                className={classes.badgeRoot}
                style={{
                  color: 'rgba(226, 167, 46)',
                  backgroundColor: 'rgba(226, 167, 46, 0.267)',
                }}>
                {GET_CHAIN_ID_NAME(chainId)}
              </Box>
            ) : null}

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
