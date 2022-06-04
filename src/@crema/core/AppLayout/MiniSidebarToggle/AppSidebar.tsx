import React, {useContext, useCallback, useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import {Badge, Paper, useTheme} from '@material-ui/core';
import clsx from 'clsx';
import Navigation from '../../Navigation/VerticleNav';
import {
  onRemoveNotification,
  onSeenNotification,
  setWeb3State,
  toggleNavCollapsed,
} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import useStyles from './AppSidebar.style';
import Scrollbar from '../../Scrollbar';
import AppContext from '../../../utility/AppContext';
import AppContextPropsType from '../../../../types/AppContextPropsType';
import {AppState} from '../../../../redux/store';

import NotificationItem from '@crema/core/Notifications/NotificationItem';

import {ReactComponent as GridFiveIcon} from 'assets/images/menu/grid-5.svg';
import {ReactComponent as NotificationIcon} from 'assets/images/menu/notification.svg';

import {ReactComponent as DexkitLogoIconImage} from 'assets/images/dexkit-logo-icon.svg';

import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import MenuIcon from '@material-ui/icons/Menu';

import {
  Grid,
  IconButton,
  Divider,
  ButtonBase,
  Avatar,
  Typography,
  MenuItem,
  Menu,
  ListItemIcon,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import {useProfileKittygotchi} from 'modules/Profile/hooks';

import {useWeb3} from 'hooks/useWeb3';
import WalletInfo from 'shared/components/WalletInfo';

import {useHistory} from 'react-router';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';

import {GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';

import IntlMessages from '@crema/utility/IntlMessages';
import Delete from '@material-ui/icons/Delete';
import {groupItems} from 'utils';
import {humanizeDate} from 'utils/date';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useCustomNetworkList} from 'hooks/network';
import {useChainInfo} from 'hooks/useChainInfo';
import {Skeleton} from '@material-ui/lab';
import SwitchNetworkDialog from 'shared/components/SwitchNetworkDialog';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {Web3State} from 'types/blockchain';
import {switchChain} from 'utils/wallet';

interface AppSidebarProps {
  variant?: string;
  position?: 'left' | 'bottom' | 'right' | 'top';
}

const AppSidebar: React.FC<AppSidebarProps> = ({position = 'left'}) => {
  const {onSwitchMagicNetwork} = useMagicProvider();
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

  const {account, chainId, getProvider} = useWeb3();

  const history = useHistory();

  const isOnLoginPage = useCallback(() => {
    return history.location.pathname === LOGIN_WALLET_ROUTE;
  }, [history]);

  const [selectedTab, setSelectedTab] = useState<'notifications' | 'menu'>(
    'menu',
  );

  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newValue: 'notifications' | 'menu') => {
      setSelectedTab(newValue);
      if (newValue === 'notifications') {
        dispatch(onSeenNotification());
      }
    },
    [dispatch],
  );

  const notificationsState = useSelector<AppState, AppState['notification']>(
    ({notification}) => notification,
  );

  const notifications = notificationsState.notifications.map((n, index) => ({
    ...n,
    id: index,
  }));

  const handleClickNotification = useCallback(() => {}, []);

  const [anchor, setAnchor] = useState<HTMLElement>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handleToggleMenu = useCallback(
    (index: number, anchor: HTMLElement | null) => {
      setMenuOpen((value) => !value);
      setSelectedIndex(index);

      if (anchor !== null) {
        setAnchor(anchor);
      }
    },
    [],
  );

  const handleRemove = useCallback(() => {
    if (selectedIndex !== undefined) {
      dispatch(onRemoveNotification(selectedIndex));
      setSelectedIndex(undefined);
      setAnchor(undefined);
      setMenuOpen(false);
    }
  }, [dispatch, selectedIndex]);

  const handleCloseMenu = useCallback(() => {
    setSelectedIndex(undefined);
    setAnchor(undefined);
    setMenuOpen(false);
  }, []);

  const theme = useTheme();

  const isMetamask = useCallback(() => {
    if (window.ethereum) {
      if ((window.ethereum as any).isMetaMask) {
        return true;
      }
    }

    return false;
  }, []);

  const {chainName} = useChainInfo();

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
  const {networks} = useCustomNetworkList();

  const handleOpenSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(true);
  }, []);

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

        const provider = getProvider();

        try {
          const customIndex = networks.findIndex((n) => n.chainId === chainId);

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
            await switchChain(provider, chainId);
          }

          window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
        } catch {
          window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
        }
      }
    },
    [dispatch, getProvider, onSwitchMagicNetwork, networks],
  );

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
      <Menu open={menuOpen} anchorEl={anchor} onClose={handleCloseMenu}>
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <Delete fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>
            <IntlMessages id='common.remove' defaultMessage='Remove' />
          </Typography>
        </MenuItem>
      </Menu>
      <Hidden smUp>
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
              <Box p={4} bgcolor={theme.palette.background.default}>
                <Grid
                  container
                  spacing={4}
                  alignItems='center'
                  alignContent='center'
                  justifyContent='space-between'>
                  <Grid item>
                    <DexkitLogoIconImage className={classes.dexkitIcon} />
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>
                      <IntlMessages id='common.menu' defaultMessage='Menu' />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleToggleDrawer} size='medium'>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <Box p={4}>
                <Grid
                  container
                  spacing={2}
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Grid item xs={12}>
                    <Paper>
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
                              onClick={handleToggleDrawer}
                              component={RouterLink}>
                              <Avatar
                                className={classes.avatar}
                                src={
                                  account && chainId
                                    ? kittygotchiProfile.getDefault(
                                        account,
                                        chainId,
                                      )?.image
                                    : undefined
                                }
                              />
                            </ButtonBase>
                          </Grid>

                          {!isOnLoginPage() || account ? (
                            <Grid item xs>
                              <WalletInfo
                                onClick={handleToggleDrawer}
                                openAccountManagerOnClick={true}
                              />
                            </Grid>
                          ) : null}
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    {isMetamask() || isMagicProvider() ? (
                      <ButtonBase
                        onClick={handleOpenSwitchNetwork}
                        className={classes.switchNetworkButton}>
                        <Typography variant='body1'>
                          {chainName !== undefined ? chainName : <Skeleton />}
                        </Typography>
                        <ExpandMore />
                      </ButtonBase>
                    ) : (
                      chainId && (
                        <ButtonBase
                          disabled
                          className={classes.switchNetworkButton}>
                          <Typography variant='body1'>
                            {chainName !== undefined ? chainName : <Skeleton />}
                          </Typography>
                          <ExpandMore />
                        </ButtonBase>
                      )
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <CustomTabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  variant='fullWidth'
                  TabIndicatorProps={{
                    style: {display: 'none'},
                  }}>
                  <CustomTab
                    value='menu'
                    icon={<GridFiveIcon className={classes.icon} />}
                  />
                  <CustomTab
                    value='notifications'
                    icon={
                      <Badge
                        variant='dot'
                        color='primary'
                        badgeContent={notificationsState.notificationsNotSeen}>
                        <NotificationIcon className={classes.icon} />
                      </Badge>
                    }
                  />
                </CustomTabs>
              </Box>
              <Divider />
              <Scrollbar className={classes.drawerScrollAppSidebar}>
                {selectedTab === 'menu' && <Navigation />}

                {selectedTab === 'notifications' &&
                  (notifications.length > 0 ? (
                    <Box py={4}>
                      {groupItems(notifications).map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                          <Box px={4}>
                            <Typography color='primary' variant='body1'>
                              {humanizeDate(group.date)}
                            </Typography>
                          </Box>
                          {group.items.map((item: any, itemIndex: number) => (
                            <NotificationItem
                              onClick={handleClickNotification}
                              id={item.id}
                              key={itemIndex}
                              item={item}
                              onMenu={handleToggleMenu}
                            />
                          ))}
                        </React.Fragment>
                      ))}
                    </Box>
                  ) : (
                    <Box p={4}>
                      <Grid
                        container
                        alignItems='center'
                        alignContent='center'
                        justify='center'
                        direction='column'
                        spacing={2}>
                        <Grid item xs={12}>
                          <NotificationIcon />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography
                            variant='body1'
                            color='textSecondary'
                            align='center'>
                            <IntlMessages
                              id='common.nothingToSeeHere'
                              defaultMessage='Nothing to see here'
                            />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
              </Scrollbar>
            </Box>
          </Box>
        </Drawer>
      </Hidden>
      <Hidden smDown>
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
                {navCollapsed ? (
                  <MenuIcon className={classes.icon} />
                ) : (
                  <MenuOpenIcon className={classes.icon} />
                )}
              </IconButton>
            </Box>
            <Divider />
            <Scrollbar className={classes.scrollAppSidebar}>
              <Navigation />
            </Scrollbar>
          </Box>
        </Box>
      </Hidden>
    </>
  );
};

export default AppSidebar;
