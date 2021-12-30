import {useIntl} from 'react-intl';
import NoWallet from 'modules/ErrorPages/NoWallet';
import TradeAllHistoryContainer from 'modules/History/TradeAllHistory/container';
import TradeHistoryContainer from 'modules/History/TradeHistory/container';
import React, {useMemo, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import NetworkChips from 'shared/components/NetworkChips';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {
  Box,
  Divider,
  Drawer,
  Grid,
  Typography,
  Chip,
  IconButton,
} from '@material-ui/core';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import Close from '@material-ui/icons/Close';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import {TransferTab} from './TransfersTab';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import TransactionsTab from './TransactionsTab';

const TAB_TRANSACTIONS = 'TAB_TRANSACTIONS';
const TAB_HISTORY = 'TAB_HISTORY';
const TAB_TRANSFERS = 'TAB_TRANSFERS';

type Props = {
  address?: string;
  token?: string;
  enableNetworkChips?: boolean;
  networkName?: EthereumNetwork;
};

export const TradeHistoryTab = (props: Props) => {
  const history = useHistory();
  const {messages} = useIntl();
  const searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, [history.location.search]);
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      props?.networkName ??
      EthereumNetwork.ethereum,
  );
  const {address, token, enableNetworkChips = true} = props;

  const onChangeNetwork = (net: EthereumNetwork | 'all') => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('network', net);
    history.push({search: searchParams.toString()});
    setNetworkName(net as EthereumNetwork);
  };

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((value) => !value);
  }, []);

  const [tab, setTab] = useState(TAB_HISTORY);

  const handleToggleHistory = useCallback(() => {
    setTab(TAB_HISTORY);
  }, []);

  const handleToggleTransfers = useCallback(() => {
    setTab(TAB_TRANSFERS);
  }, []);

  const handleToggleTransactions = useCallback(() => {
    setTab(TAB_TRANSACTIONS);
  }, []);

  return address ? (
    <>
      <Drawer open={showFilters} anchor='right' onClose={handleToggleFilters}>
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Grid container justify='space-between' alignItems='center'>
                  <Grid item>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <FilterSearchIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant='body1'>
                          <IntlMessages id='app.dashboard.filter' />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <IconButton size='small' onClick={handleToggleFilters}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom variant='body1'>
                <IntlMessages id='app.dashboard.network' />
              </Typography>
            </Grid>
            {enableNetworkChips ? (
              <Grid item xs={12}>
                <NetworkChips
                  networkName={networkName}
                  onClick={onChangeNetwork}
                  enableAll={false}
                />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Drawer>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justify='space-between'
            alignItems='baseline'>
            <Grid item />
            <Grid item>
              <Grid container spacing={4}>
                <Grid item>
                  <Chip
                    clickable
                    onClick={handleToggleTransactions}
                    variant={tab === TAB_TRANSACTIONS ? 'default' : 'outlined'}
                    label={messages['app.wallet.transactions'] as string}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    onClick={handleToggleHistory}
                    variant={tab === TAB_HISTORY ? 'default' : 'outlined'}
                    label={messages['app.wallet.history'] as string}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    onClick={handleToggleTransfers}
                    variant={tab === TAB_TRANSFERS ? 'default' : 'outlined'}
                    label={messages['app.wallet.transfers'] as string}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <SquaredIconButton onClick={handleToggleFilters}>
                <FilterSearchIcon />
              </SquaredIconButton>
            </Grid>
          </Grid>
        </Grid>
        {tab === TAB_TRANSFERS ? (
          <TransferTab address={address} networkName={networkName} />
        ) : tab === TAB_TRANSACTIONS ? (
          <Grid item xs={12}>
            <TransactionsTab />
          </Grid>
        ) : (
          <>
            {token ? (
              <Grid item xs={12}>
                <TradeHistoryContainer
                  address={address}
                  token={token}
                  networkName={networkName}
                />
              </Grid>
            ) : null}
            {!token ? (
              <Grid item xs={12}>
                <TradeAllHistoryContainer
                  address={address}
                  networkName={networkName}
                />
              </Grid>
            ) : null}
          </>
        )}
      </Grid>
    </>
  ) : (
    <NoWallet />
  );
};
