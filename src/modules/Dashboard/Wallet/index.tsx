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

import PageTitle from 'shared/components/PageTitle';

import {useWeb3} from 'hooks/useWeb3';
import TotalBalance from 'shared/components/TotalBalance';
import ErrorView from 'modules/Common/ErrorView';

import {truncateIsAddress} from 'utils';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import AppContextPropsType from 'types/AppContextPropsType';
import AppContext from '@crema/utility/AppContext';
import {useStyles} from './index.style';
import AppBar from '@material-ui/core/AppBar';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import TimelineIcon from '@material-ui/icons/Timeline';

import AssessmentIcon from '@material-ui/icons/Assessment';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import {AssetChartTab} from './Tabs/AssetChartTab';
import {AssetTableTab} from './Tabs/AssetTableTab';
import {TradeHistoryTab} from './Tabs/TradeHistoryTab';
import {TransferTab} from './Tabs/TransfersTab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {Fonts} from 'shared/constants/AppEnums';
import {AboutDialog} from './AboutDialog';
import SettingsIcon from '@material-ui/icons/Settings';
import {TradeToolsSection} from './components/TradeToolsSection';
import {SwapComponent} from '../Swap/Swap';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {TokensGroupActionButton} from 'shared/components/TokensGroupActionButton';
import {ArrowForward} from '@material-ui/icons';

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

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (
      urlAccount &&
      Web3Wrapper.isAddress(urlAccount) &&
      defaultAccount !== urlAccount
    ) {
      history.push(`/dashboard/wallet/${urlAccount}`);
      dispatch(setDefaultAccount({address: urlAccount, label: urlAccount}));
    }
    if (!urlAccount && defaultAccount) {
      history.push(`/dashboard/wallet/${defaultAccount}`);
    }
  }, [urlAccount, defaultAccount]);

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
                  <Card>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <Grid
                            container
                            alignItems='center'
                            justify='space-between'>
                            <Grid item>
                              <Typography variant='body1'>Groups</Typography>
                            </Grid>
                            <Grid item>
                              <Button endIcon={<KeyboardArrowRightIcon />}>
                                View more
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <TokensGroupActionButton
                            title='Explorer'
                            subtitle='lorem ipsum indolor'
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TokensGroupActionButton
                            title='Explorer'
                            subtitle='lorem ipsum indolor'
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Card>
                    <CardContent>
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
                                size='small'
                                endIcon={<KeyboardArrowRightIcon />}>
                                View more
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}></Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
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
        </Box>
      </TabContext>
    </>
  );
};

export default WalletTabs;
