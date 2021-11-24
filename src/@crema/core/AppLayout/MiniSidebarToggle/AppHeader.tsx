import React, {useState, useCallback, useEffect} from 'react';

import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LanguageSwitcher from '../../LanguageSwitcher';
import {setWeb3State, toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppHeader.style';
import HeaderMessages from '../../HeaderMessages';
import Notifications from '../../Notifications';

import WalletInfo from 'shared/components/WalletInfo';

import {useWeb3} from 'hooks/useWeb3';
import {GET_CHAIN_ID_NAME} from 'shared/constants/Blockchain';

import clsx from 'clsx';

import {
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  ButtonBase,
  IconButton,
} from '@material-ui/core';
import AppBarButton from 'shared/components/AppBar/AppBarButton';

import {Link as RouterLink} from 'react-router-dom';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import {ReactComponent as LeagueLogoImage} from 'assets/images/dashboard/league-logo.svg';
import {ReactComponent as LeagueIconLogoImage} from 'assets/images/dashboard/league-icon-logo.svg';

import {useHistory} from 'react-router';
import SwitchNetworkDialog from 'shared/components/SwitchNetworkDialog';
import {switchChain} from 'utils/wallet';
import {GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';
import {Web3State} from 'types/blockchain';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';

import {useProfileKittygotchi} from '../../../../modules/Profile/hooks/index';

import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import {useKittygotchiV2} from 'modules/Kittygotchi/hooks';
interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const {chainId, getProvider, account} = useWeb3();
  const {onSwitchMagicNetwork} = useMagicProvider();

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
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

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMobileMenuToggle = useCallback(() => {
    dispatch(toggleNavCollapsed());
  }, [dispatch]);

  // const onClickSearchToken = (token: Token) => {
  //   if (token) {
  //     if (token.address) {
  //       history.push(`/explorer/${token.address}?network=${token.networkName}`);
  //     } else {
  //       const add = GET_DEFAULT_TOKEN_BY_NETWORK(token.networkName);
  //       if (add) {
  //         history.push(`/explorer/${add}?network=${token.networkName}`);
  //       }
  //     }
  //   }
  // };

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

  const handleCloseSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(false);
  }, []);

  const handleSelectChain = useCallback(
    async (chainId: number) => {
      setShowSwitchNetwork(false);

      if (isMagicProvider()) {
        const magicNetwork = GET_MAGIC_NETWORK_FROM_CHAIN_ID(chainId);
        onSwitchMagicNetwork(magicNetwork);
      } else {
        dispatch(setWeb3State(Web3State.Connecting));
        try {
          await switchChain(getProvider(), chainId);
          window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
        } catch {
          dispatch(setWeb3State(Web3State.Done));
        }
      }
    },
    [dispatch, getProvider, isMagicProvider],
  );

  const handleOpenSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(true);
  }, []);

  const isOnLoginPage = useCallback(() => {
    return history.location.pathname === LOGIN_WALLET_ROUTE;
  }, [history]);

  const isMetamask = useCallback(() => {
    if (window.ethereum) {
      if ((window.ethereum as any).isMetaMask) {
        return true;
      }
    }

    return false;
  }, []);

  const kittygotchiProfile = useProfileKittygotchi();
  const kittygotchi = useKittygotchiV2();

  useEffect(() => {
    if (chainId && account) {
      const defaultKitty = kittygotchiProfile.getDefault(account, chainId);

      if (defaultKitty) {
        kittygotchi.get(defaultKitty.id).then((kitty) => {
          if (account && chainId && kitty) {
            kittygotchiProfile.setDefaultKittygothchi(account, chainId, kitty);
          }
        });
      }
    }
  }, [chainId, account]);

  return (
    <>
      {chainId ? (
        <SwitchNetworkDialog
          selected={chainId}
          open={showSwitchNetwork}
          onSelectChain={handleSelectChain}
          onClose={handleCloseSwitchNetwork}
        />
      ) : null}
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
                  {isMobile ? <LeagueIconLogoImage /> : <LeagueLogoImage />}
                </Grid>
                <Grid item>
                  <Grid
                    container
                    alignItems='center'
                    alignContent='center'
                    spacing={2}>
                    {isMetamask() || isMagicProvider() ? (
                      <Grid item>
                        {chainId !== undefined ? (
                          <Grid item>
                            <ButtonBase
                              onClick={handleOpenSwitchNetwork}
                              className={classes.switchNetworkButton}>
                              <Box className={classes.badgeRoot}>
                                {GET_CHAIN_ID_NAME(chainId)}
                                <IconButton size='small'>
                                  <ExpandMoreIcon />
                                </IconButton>
                              </Box>
                            </ButtonBase>
                          </Grid>
                        ) : null}
                      </Grid>
                    ) : (
                      <Grid item>
                        <Box
                          className={classes.badgeRoot}
                          display={'flex'}
                          alignItems={'center'}>
                          {GET_CHAIN_ID_NAME(chainId)}
                        </Box>
                      </Grid>
                    )}
                    {!isOnLoginPage() || account ? (
                      <Grid item>
                        <WalletInfo />
                      </Grid>
                    ) : null}
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
                  <LeagueLogoImage /> 
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
                {/* <TokenSearch onClick={onClickSearchToken} /> */}
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  alignContent='center'>
                  {chainId !== undefined &&
                  (isMetamask() || isMagicProvider()) ? (
                    <Grid item>
                      <ButtonBase
                        onClick={handleOpenSwitchNetwork}
                        className={classes.switchNetworkButton}>
                        <Box
                          className={classes.badgeRoot}
                          display={'flex'}
                          alignItems={'center'}>
                          {GET_CHAIN_ID_NAME(chainId)}
                          <ExpandMoreIcon />
                        </Box>
                      </ButtonBase>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Box
                        className={classes.badgeRoot}
                        display={'flex'}
                        alignItems={'center'}>
                        {GET_CHAIN_ID_NAME(chainId)}
                      </Box>
                    </Grid>
                  )}
                  {!isOnLoginPage() || account ? (
                    <Grid item>
                      <WalletInfo />
                    </Grid>
                  ) : null}
                  <Grid item>
                    <Notifications />
                  </Grid>
                 {/* <Grid item>
                    <ButtonBase
                      className={classes.avatarButton}
                      to='/profile'
                      component={RouterLink}>
                      <Avatar
                        className={classes.avatar}
                        src={
                          account && chainId
                            ? kittygotchiProfile.getDefault(account, chainId)
                                ?.image
                            : undefined
                        }
                      />
                      </ButtonBase>
                  </Grid>*/}
                  {/* <Grid item>
                    <AppBarButton>
                      <SettingsIcon />
                    </AppBarButton>
                  </Grid> */}
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
