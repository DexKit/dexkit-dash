import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

import NoWallet from 'modules/ErrorPages/NoWallet';
import TradeAllHistoryContainer from 'modules/History/TradeAllHistory/container';
import TradeHistoryContainer from 'modules/History/TradeHistory/container';
import {useHistory} from 'react-router-dom';
import NetworkChips from 'shared/components/NetworkChips';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import Close from '@material-ui/icons/Close';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import {TransferTab} from './TransfersTab';

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
  }, []);
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

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showTransfers, setShowTransfers] = useState(false);

  const handleToggleTransfers = useCallback(() => {
    setShowTransfers((value) => !value);
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
                          {messages['app.filter']}
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
                {messages['app.network']}
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
                    onClick={handleToggleTransfers}
                    variant={!showTransfers ? 'default' : 'outlined'}
                    label={messages['app.history'] as string}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    onClick={handleToggleTransfers}
                    variant={showTransfers ? 'default' : 'outlined'}
                    label={messages['app.transfers'] as string}
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
        {showTransfers ? (
          <TransferTab address={address} networkName={networkName} />
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
