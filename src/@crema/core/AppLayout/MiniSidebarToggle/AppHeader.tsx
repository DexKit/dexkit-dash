import React, {useState, useCallback} from 'react';

import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LanguageSwitcher from '../../LanguageSwitcher';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppHeader.style';
import HeaderMessages from '../../HeaderMessages';
import Notifications from '../../Notifications';

import WalletInfo from 'shared/components/WalletInfo';

import {useWeb3} from 'hooks/useWeb3';
import {
  GET_CHAIN_ID_NAME,
  GET_DEFAULT_TOKEN_BY_NETWORK,
} from 'shared/constants/Blockchain';

import clsx from 'clsx';
import {AppState} from 'redux/store';

import {Grid, useTheme, useMediaQuery, Container} from '@material-ui/core';
import AppBarButton from 'shared/components/AppBar/AppBarButton';

import {ReactComponent as SettingsIcon} from 'assets/images/icons/settings.svg';

import {ReactComponent as DexkitLogoImage} from 'assets/images/dexkit-logo.svg';
import {TokenSearch} from 'shared/components/TokenSearch';
import {useHistory} from 'react-router';
import {Token} from 'types/app';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const {chainId, forceWeb3Connect} = useWeb3();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

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

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMobileMenuToggle = useCallback(() => {
    dispatch(toggleNavCollapsed());
  }, [dispatch]);

  const onClickSearchToken = (token: Token) => {
    if (token) {
      if (token.address) {
        history.push(`/explorer/${token.address}?network=${token.networkName}`);
      } else {
        const add = GET_DEFAULT_TOKEN_BY_NETWORK(token.networkName);
        if (add) {
          history.push(`/explorer/${add}?network=${token.networkName}`);
        }
      }
    }
  };

  return (
    <>
      <Box className={clsx(classes.appBar, 'app-bar')}>
        <Container
          maxWidth='xl'
          style={
            !isMobile
              ? {
                  paddingLeft: theme.spacing(8),
                  paddingRight: theme.spacing(8),
                }
              : {
                  paddingLeft: theme.spacing(2),
                  paddingRight: theme.spacing(2),
                }
          }>
          {isMobile ? (
            <Box>
              <Grid
                container
                justify='space-between'
                alignItems='center'
                alignContent='center'>
                <Grid item>
                  <DexkitLogoImage />
                </Grid>
                <Grid item>
                  <Grid
                    container
                    alignItems='center'
                    alignContent='center'
                    spacing={2}>
                    <Grid item>
                      {chainId !== undefined ? (
                        <Grid item>
                          <Box
                            className={classes.badgeRoot}
                            style={{
                              color: 'rgba(226, 167, 46)',
                              backgroundColor: 'rgba(226, 167, 46, 0.267)',
                            }}>
                            {GET_CHAIN_ID_NAME(chainId)}
                          </Box>
                        </Grid>
                      ) : null}
                    </Grid>
                    <Grid item>
                      <AppBarButton onClick={handleMobileMenuToggle}>
                        <MenuIcon />
                      </AppBarButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Grid
              container
              alignItems='center'
              alignContent='center'
              spacing={2}>
              <Grid item>
                <Box mr={4}>
                  <DexkitLogoImage />
                </Box>
              </Grid>
              <Grid item xs>
                {/*  <AppBarSearchInput
                  placeholder='Search for tokens, pools and vaults'
                  startAdornment={
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  }
                  fullWidth
                /> */}
                <TokenSearch onClick={onClickSearchToken} />
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  alignContent='center'>
                  {chainId !== undefined ? (
                    <Grid item>
                      <Box
                        className={classes.badgeRoot}
                        style={{
                          color: 'rgba(226, 167, 46)',
                          backgroundColor: 'rgba(226, 167, 46, 0.267)',
                        }}>
                        {GET_CHAIN_ID_NAME(chainId)}
                      </Box>
                    </Grid>
                  ) : null}
                  <Grid item>
                    <WalletInfo />
                  </Grid>
                  <Grid item>
                    <Notifications />
                  </Grid>
                  <Grid item>
                    <AppBarButton>
                      <SettingsIcon />
                    </AppBarButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;
