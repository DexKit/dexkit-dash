import React, {useCallback, useContext, useEffect, useState} from 'react';

import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
} from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core';

import {FavoritesEmptyImage} from 'shared/components/Icons';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';
import TotalBalance from 'shared/components/TotalBalance';
import ErrorView from 'modules/Common/ErrorView';

import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {SupportedNetworkType} from 'types/blockchain';
import AppContextPropsType from 'types/AppContextPropsType';
import AppContext from '@crema/utility/AppContext';
import {useStyles} from './index.style';

import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import {AssetTableTab} from './Tabs/AssetTableTab';
import {TradeHistoryTab} from './Tabs/TradeHistoryTab';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {useFavoritesWithMarket} from 'hooks/useFavoritesWithMarket';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';
import FavoriteListItem from 'shared/components/FavoriteListItem';
import NFTTable from './components/NFTTable';
import IntlMessages from '../../../@crema/utility/IntlMessages';

type Params = {
  account: string;
};

type Props = RouteComponentProps<Params>;

const WalletTabs: React.FC<Props> = (props) => {
  /* eslint-disable */
  const {messages} = useIntl();
  const {
    match: {params},
  } = props;
  const {account: urlAccount} = params;

  const history = useHistory();
  const {theme: cremaTheme} = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles(cremaTheme);
  const defaultAccount = useDefaultAccount();
  const defaultLabel = useDefaultLabelAccount();

  const [hideBalance, setHideBalance] = useState(false);

  const dispatch = useDispatch();
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;
  const searchParams = new URLSearchParams(history.location.search);
  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'assets');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({search: searchParams.toString()});
    setValue(newValue);
  };
  const {loading, error, data, nftBalances, loadingUsd} =
    useAllBalance(defaultAccount);

  useEffect(() => {
    if (
      urlAccount &&
      Web3Wrapper.isAddress(urlAccount) &&
      defaultAccount !== urlAccount
    ) {
      history.push(`/wallet/${urlAccount}`);
      dispatch(
        setDefaultAccount({
          account: {
            address: urlAccount,
            label: urlAccount,
            networkType: SupportedNetworkType.evm,
          },
          type: SupportedNetworkType.evm,
        }),
      );
    }
    if (!urlAccount && defaultAccount) {
      history.push(`/wallet/${defaultAccount}`);
    }
  }, [urlAccount, defaultAccount]);

  const favoritesWithMarket = useFavoritesWithMarket();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleBalance = useCallback(() => {
    setHideBalance((value) => !value);
  }, []);

  return (
    <>
      <TabContext value={value}>
        <Box pt={{xl: 4}}>
          <Box mb={4}>
            <Typography variant='h5'>
              <IntlMessages id='app.dashboard.wallet' />
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              {error && !data ? (
                <ErrorView message={error.message} />
              ) : (
                <TotalBalance
                  address={account}
                  balances={data}
                  loading={loading}
                  loadingUsd={loadingUsd}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={4}>
                    <Grid item xs={isMobile ? 12 : undefined}>
                      <CustomTabs
                        value={value}
                        onChange={handleChange}
                        variant='standard'
                        TabIndicatorProps={{
                          style: {display: 'none'},
                        }}
                        aria-label='wallet tabs'>
                        <CustomTab
                          value='assets'
                          label={messages['app.dashboard.assets'] as string}
                        />
                        {/* <CustomTab value='nfts' label={'NFTs'} /> */}
                        <CustomTab
                          value='trade-history'
                          label={messages['app.dashboard.history'] as string}
                        />
                      </CustomTabs>
                    </Grid>
                    <Grid item xs={12}>
                      <TabPanel className={classes.zeroPadding} value='assets'>
                        <AssetTableTab
                          account={account as string}
                          loading={loading}
                          error={error}
                          data={data}
                        />
                      </TabPanel>
                      <TabPanel className={classes.zeroPadding} value='nfts'>
                        <NFTTable
                          loading={loading}
                          error={error}
                          balances={nftBalances}
                        />
                      </TabPanel>
                      <TabPanel value='trade-history'>
                        <TradeHistoryTab address={defaultAccount} />
                      </TabPanel>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignItems='center'
                        justify='space-between'>
                        <Grid item>
                          <Typography variant='body1' style={{fontWeight: 600}}>
                            <IntlMessages id='app.dashboard.favorites' />
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            to='/favorite-coins'
                            component={RouterLink}
                            size='small'
                            endIcon={<KeyboardArrowRightIcon />}>
                            <IntlMessages id='app.dashboard.viewMore' />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {favoritesWithMarket.data.length > 0 ? (
                        <>
                          {favoritesWithMarket.loading ? (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              {favoritesWithMarket.data.map(
                                (favorite, index) => (
                                  <Grid item xs={12} key={index}>
                                    <FavoriteListItem
                                      coin={favorite.coin}
                                      amount={
                                        favorite.market?.current_price || 0
                                      }
                                      dayChange={
                                        favorite.market
                                          ?.price_change_percentage_24h || 0
                                      }
                                    />
                                  </Grid>
                                ),
                              )}
                            </Grid>
                          )}
                        </>
                      ) : (
                        <Paper>
                          <Box p={4}>
                            <Box
                              display='flex'
                              py={4}
                              alignItems='center'
                              alignContent='center'
                              justifyContent='center'>
                              <FavoritesEmptyImage />
                            </Box>
                            <Typography
                              gutterBottom
                              variant='body1'
                              align='center'>
                              <IntlMessages id='app.dashboard.youDontHaveFavoritesYet' />
                              .
                            </Typography>
                            <Typography
                              variant='body2'
                              align='center'
                              color='primary'>
                              <Link
                                to={`/explorer/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`}
                                component={RouterLink}>
                                <IntlMessages id='app.dashboard.goToExplorer' />
                              </Link>
                            </Typography>
                          </Box>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </TabContext>
    </>
  );
};

export default WalletTabs;
