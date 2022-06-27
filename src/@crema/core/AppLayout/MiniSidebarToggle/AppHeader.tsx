import React, {useState, useCallback, useEffect, useContext} from 'react';

import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LanguageSwitcher from '../../LanguageSwitcher';
import {setWeb3State, toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppHeader.style';
import HeaderMessages from '../../HeaderMessages';
import Notifications from '../../Notifications';

import {useCustomNetworkList} from 'hooks/network';

import WalletInfo from 'shared/components/WalletInfo';

import {useWeb3} from 'hooks/useWeb3';

import clsx from 'clsx';

import {
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  ButtonBase,
  Badge,
  Paper,
  IconButton,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {ReactComponent as DexkitLogoImage} from 'assets/images/dexkit-logo.svg';
import {ReactComponent as DexkitLogoIconImage} from 'assets/images/dexkit-logo-icon.svg';

import {useHistory} from 'react-router';
import SwitchNetworkDialog from 'shared/components/SwitchNetworkDialog';
import {switchChain} from 'utils/wallet';
import {GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';
import {Web3State} from 'types/blockchain';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';

import {useProfileKittygotchi} from '../../../../modules/Profile/hooks/index';

import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import {useKittygotchiV2, useKittygotchiList} from 'modules/Kittygotchi/hooks';
import {useChainInfo} from 'hooks/useChainInfo';
import {AppState} from 'redux/store';
import AppContext from '@crema/utility/AppContext';
import AppContextPropsType from 'types/AppContextPropsType';
interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const {chainId, getProvider, account} = useWeb3();
  const {onSwitchMagicNetwork} = useMagicProvider();

  const {themeMode} = useContext<AppContextPropsType>(AppContext);

  const classes = useStyles({themeMode});
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
  const {networks} = useCustomNetworkList();

  const handleCloseSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(false);
  }, []);

  const handleSelectChain = useCallback(
    async (_chainId: number) => {
      setShowSwitchNetwork(false);

      if (isMagicProvider()) {
        const magicNetwork = GET_MAGIC_NETWORK_FROM_CHAIN_ID(_chainId);
        onSwitchMagicNetwork(magicNetwork);
      } else {
        dispatch(setWeb3State(Web3State.Connecting));

        const provider = getProvider();

        try {
          const customIndex = networks.findIndex((n) => n.chainId === _chainId);

          if (customIndex > -1) {
            const params: {
              chainId: string; // A 0x-prefixed hexadecimal string
              chainName: string;
              nativeCurrency?: {
                name: string;
                symbol: string; // 2-6 characters long
                decimals: number;
              };
              rpcUrls: string[];
              blockExplorerUrls?: string[];
              iconUrls?: string[]; // Currently ignored.
            } = {
              chainId: '0x' + networks[customIndex].chainId.toString(16),
              chainName: networks[customIndex].name,
              rpcUrls: [networks[customIndex].rpcUrl],
              blockExplorerUrls: networks[customIndex].explorerUrl
                ? [networks[customIndex].explorerUrl]
                : undefined,
            };

            const nativeCurrency: {
              name: string;
              symbol: string;
              decimals: number;
            } = {
              name: networks[customIndex].name,
              //@ts-ignore
              symbol: networks[customIndex].symbol,
              decimals: 18,
            };

            if (networks[customIndex].nativeTokenSymbol) {
              nativeCurrency.symbol = networks[customIndex].nativeTokenSymbol;
            }

            params.nativeCurrency = nativeCurrency;

            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [params],
            });
          } else {
            await switchChain(provider, _chainId);
          }

          //  window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
        } catch {
          //  window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
        }
      }
    },
    [dispatch, getProvider, onSwitchMagicNetwork, networks],
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
  const kittyGotchiList = useKittygotchiList();

  useEffect(() => {
    if (chainId && account) {
      const defaultKitty = kittygotchiProfile.getDefault(account, chainId);

      if (defaultKitty) {
        kittygotchi.get(defaultKitty.id).then((kitty) => {
          if (account && chainId && kitty) {
            kittygotchiProfile.setDefaultKittygothchi(account, chainId, kitty);
          }
        });
      } else {
        kittyGotchiList.get(account.toLowerCase()).then((kitties) => {
          if (kitties && kitties.length && account && chainId) {
            kittygotchiProfile.setDefaultKittygothchi(
              account,
              chainId,
              kitties[0],
            );
          }
        });
      }
    }
    /* eslint-disable */
  }, [chainId, account]);

  const {chainName} = useChainInfo();

  const {notificationsNotSeen} = useSelector<
    AppState,
    AppState['notification']
  >(({notification}) => notification);

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
            <Box px={2}>
              <Grid
                container
                justify='space-between'
                alignItems='center'
                alignContent='center'>
                <Grid item>
                  <Box pl={4} pt={3}>
                    <DexkitLogoIconImage className={classes.dexkitIcon} />
                  </Box>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    alignItems='center'
                    alignContent='center'
                    spacing={2}>
                    <Grid item>
                      <ButtonBase
                        className={classes.avatarButton}
                        to='/profile'
                        component={RouterLink}>
                        <Avatar
                          classes={{fallback: classes.fallback}}
                          src={
                            account && chainId
                              ? kittygotchiProfile.getDefault(account, chainId)
                                  ?.image
                              : undefined
                          }
                        />
                      </ButtonBase>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleMobileMenuToggle}>
                        <Badge
                          variant='dot'
                          color='primary'
                          badgeContent={notificationsNotSeen}>
                          <MenuIcon />
                        </Badge>
                      </IconButton>
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
                  <DexkitLogoImage className={classes.dexkitIcon} />
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
                          {chainName}
                          <ExpandMoreIcon />
                        </Box>
                      </ButtonBase>
                    </Grid>
                  ) : (
                    chainId && (
                      <Grid item>
                        <Box
                          className={classes.badgeRoot}
                          display={'flex'}
                          alignItems={'center'}>
                          {chainName}
                        </Box>
                      </Grid>
                    )
                  )}
                  {!isOnLoginPage() || account ? (
                    <Grid item>
                      <Paper>
                        <WalletInfo />
                      </Paper>
                    </Grid>
                  ) : null}
                  <Grid item>
                    <Notifications />
                  </Grid>
                  <Grid item>
                    <ButtonBase
                      className={classes.avatarButton}
                      to='/profile'
                      component={RouterLink}>
                      <Avatar
                        classes={{fallback: classes.fallback}}
                        className={classes.avatar}
                        src={
                          account && chainId
                            ? kittygotchiProfile.getDefault(account, chainId)
                                ?.image
                            : undefined
                        }
                      />
                    </ButtonBase>
                  </Grid>
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
