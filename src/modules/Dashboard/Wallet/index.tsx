import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import {RouteComponentProps, useHistory} from 'react-router-dom';
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
import {TransferTab} from './Tabs/TransfersTab';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import TokenListItem from 'shared/components/TokenListItem';
import {useFavoritesWithMarket} from 'hooks/useFavoritesWithMarket';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';
import FavoriteListItem from 'shared/components/FavoriteListItem';
import NFTTable from './components/NFTTable';

type Params = {
  account: string;
};

type Props = RouteComponentProps<Params>;

const WalletTabs: React.FC<Props> = (props) => {
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
  const {loading, error, data, nftBalances, loadingUsd} = useAllBalance(defaultAccount);

  useEffect(() => {
    if (!urlAccount && defaultAccount) {
      history.push(`/wallet/${defaultAccount}`);
    }
  }, [urlAccount, defaultAccount]);

  const favoritesWithMarket = useFavoritesWithMarket();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <TabContext value={value}>
        <Box pt={{xl: 4}}>
          <Box mb={4}>
            <Typography variant='h5'>Wallet</Typography>
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
                        <CustomTab value='assets' label={'Assets'} />
                      {/*  <CustomTab value='nfts' label={'NFTs'} />*/}
                        <CustomTab value='trade-history' label={'History'} />
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
                            Favorites
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            to='/favorite-coins'
                            component={RouterLink}
                            size='small'
                            endIcon={<KeyboardArrowRightIcon />}>
                            View more
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
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
                          {favoritesWithMarket.data.map((favorite, index) => (
                            <Grid item xs={12} key={index}>
                              <FavoriteListItem
                                coin={favorite.coin}
                                amount={favorite.market?.current_price || 0}
                                dayChange={
                                  favorite.market
                                    ?.price_change_percentage_24h || 0
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
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
