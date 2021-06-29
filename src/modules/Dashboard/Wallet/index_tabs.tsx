import React, { useContext, useEffect } from 'react';

import { Grid, Box, Tabs, Paper, Tab } from '@material-ui/core';

import { RouteComponentProps, useHistory } from 'react-router-dom';

import GridContainer from '@crema/core/GridContainer';


import { useIntl } from 'react-intl';


import PageTitle from 'shared/components/PageTitle';

import { useWeb3 } from 'hooks/useWeb3';
import TotalBalance from 'shared/components/TotalBalance';
import ErrorView from 'modules/Common/ErrorView';

import { truncateAddress } from 'utils';
import { useAllBalance } from 'hooks/balance/useAllBalance';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { setDefaultAccount } from 'redux/_ui/actions';
import { useDispatch } from 'react-redux';
import AppContextPropsType from 'types/AppContextPropsType';
import AppContext from '@crema/utility/AppContext';
import { useStyles } from './index.style';
import AppBar from '@material-ui/core/AppBar';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import TimelineIcon from '@material-ui/icons/Timeline';

import AssessmentIcon from '@material-ui/icons/Assessment';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import { AssetChartTab } from './Tabs/AssetChartTab';
import { AssetTableTab } from './Tabs/AssetTableTab';
import { TradeHistoryTab } from './Tabs/TradeHistoryTab';
import { TransferTab } from './Tabs/TransfersTab';


type Params = {
  account: string;
};

type Props = RouteComponentProps<Params>;

const WalletTabs: React.FC<Props> = (props) => {
  const { messages } = useIntl();
  const {
    match: { params },
  } = props;
  const { account: urlAccount } = params;
  const history = useHistory();
  const { theme } = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles(theme);
  const defaultAccount = useDefaultAccount();
  const dispatch = useDispatch()
  const { account: web3Account } = useWeb3();
  const account = defaultAccount || web3Account;
  let searchParams = new URLSearchParams(history.location.search); 
  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'assets');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    let searchParams = new URLSearchParams(history.location.search); 
    searchParams.set('tab', newValue);
    history.push({search:searchParams.toString()});

    setValue(newValue);
  };
  const { loading, error, data } = useAllBalance(defaultAccount);


  useEffect(() => {
    if (urlAccount && Web3Wrapper.isAddress(urlAccount) && defaultAccount !== urlAccount) {
      history.push(`/dashboard/wallet/${urlAccount}`)
      dispatch(setDefaultAccount(urlAccount))
    }
    if (!urlAccount && defaultAccount) {
      history.push(`/dashboard/wallet/${defaultAccount}`)
    }

  }, [urlAccount, defaultAccount])


  return (
    <Box pt={{ xl: 4 }}>
      <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: '/dashboard/wallet', name: 'Wallet' },
          ],
          active: { name: `${truncateAddress(defaultAccount)}`, hasCopy: account },
        }}
        title={{ name: 'Wallet' }}
      />
      <GridContainer>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} md={12}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <TotalBalance balances={data} loading={loading} />
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
        <Box mt={2}>
          <Paper square>
            <TabContext value={value}>
              <AppBar position="static" color='transparent'>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="fullWidth"
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="wallet tabs"
                >
                  <Tab value="assets" icon={<AssessmentIcon />} label="Assets" />
                  <Tab value="assets-chart" icon={<TimelineIcon />} label="Assets Chart" />
                  <Tab value="transfers" icon={<SwapVertIcon />} label="Transfers" />
                  <Tab value="trade-history" icon={<SwapHorizontalCircleIcon />} label="Trade History" />
                </Tabs>
              </AppBar>
              <TabPanel value="assets">
                <AssetTableTab account={account as string} loading={loading} error={error} data={data} />
              </TabPanel>
              <TabPanel value="assets-chart">
                <AssetChartTab data={data} loading={loading} />
              </TabPanel>
              <TabPanel value="transfers">
                <TransferTab address={defaultAccount} />
              </TabPanel>
              <TabPanel value="trade-history">
                <TradeHistoryTab address={defaultAccount} />
              </TabPanel>

            </TabContext>
          </Paper>
        </Box>
        </Grid>



      </GridContainer>
    </Box>
  );
};

export default WalletTabs;
