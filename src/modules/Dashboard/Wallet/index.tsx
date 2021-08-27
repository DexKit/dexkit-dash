import React, {useContext, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
  Grid,
  Box,
  Tabs,
  Paper,
  Tab,
  Typography,
  Link,
  Tooltip,
  Button,
  Card,
  CardContent,
  Backdrop,
} from '@material-ui/core';

import {RouteComponentProps, useHistory} from 'react-router-dom';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import GridContainer from '@crema/core/GridContainer';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';
import TotalBalance from 'shared/components/TotalBalance';
import ErrorView from 'modules/Common/ErrorView';

import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import AppContextPropsType from 'types/AppContextPropsType';
import AppContext from '@crema/utility/AppContext';
import {useStyles} from './index.style';

import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import {AssetTableTab} from './Tabs/AssetTableTab';
import {TradeHistoryTab} from './Tabs/TradeHistoryTab';
import {TransferTab} from './Tabs/TransfersTab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {TokensGroupActionButton} from 'shared/components/TokensGroupActionButton';
import TokenListItem from 'shared/components/TokenListItem';
import {useFavoritesWithMarket} from 'hooks/useFavoritesWithMarket';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';
import TokenCard from 'shared/components/TokenCard';
import TokenLogo from 'shared/components/TokenLogo';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import TokenPairCard, {TokenPairIcon} from 'shared/components/TokenPairCard';

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
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles(theme);
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
  const {loading, error, data} = useAllBalance(defaultAccount);

  useEffect(() => {
    if (
      urlAccount &&
      Web3Wrapper.isAddress(urlAccount) &&
      defaultAccount !== urlAccount
    ) {
      history.push(`/wallet/${urlAccount}`);
      dispatch(setDefaultAccount({address: urlAccount, label: urlAccount}));
    }
    if (!urlAccount && defaultAccount) {
      history.push(`/wallet/${defaultAccount}`);
    }
  }, [urlAccount, defaultAccount]);

  const favoritesWithMarket = useFavoritesWithMarket();

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
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignItems='center'
                        justify='space-between'>
                        <Grid item>
                          <Typography variant='body1'>Favorites</Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            to='/dashboard/favorite-coins'
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
                        favoritesWithMarket.data.map((favorite) => (
                          <TokenListItem
                            address={favorite.coin.address}
                            dayChange={
                              favorite.market.price_change_percentage_24h || 0
                            }
                            amount={favorite.market.current_price}
                            symbol={favorite.coin.symbol}
                            name={favorite.coin.name}
                            network={favorite.coin?.networkName || ''}
                          />
                        ))
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={4}>
                    <Grid item>
                      <CustomTabs
                        value={value}
                        onChange={handleChange}
                        variant='standard'
                        TabIndicatorProps={{
                          style: {display: 'none'},
                        }}
                        aria-label='wallet tabs'>
                        <CustomTab value='assets' label={'Assets'} />
                        <CustomTab value='trade-history' label={'History'} />
                      </CustomTabs>
                    </Grid>
                    <Grid item xs={12}>
                      <TabPanel value='assets'>
                        <AssetTableTab
                          account={account as string}
                          loading={loading}
                          error={error}
                          data={data}
                        />
                      </TabPanel>
                      <TabPanel value='transfers'>
                        <TransferTab address={defaultAccount} />
                      </TabPanel>
                      <TabPanel value='trade-history'>
                        <TradeHistoryTab address={defaultAccount} />
                      </TabPanel>
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
