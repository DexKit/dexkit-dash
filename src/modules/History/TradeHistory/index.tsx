import React, { useEffect, useMemo } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Grid, Box, Paper, Toolbar, Typography } from '@material-ui/core';
import { GridContainer } from '@crema';

import { useStyles } from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { useIntl } from 'react-intl';
import PageTitle from 'shared/components/PageTitle';

import { truncateAddress } from 'utils/text';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useCoingeckoTokenInfo } from 'hooks/useCoingeckoTokenInfo';
import { useTradeHistory } from 'hooks/history/useTradeHistory';
import { TokenAnalytics } from 'modules/Dashboard/Token/Analytics';
import TradeHistoryContainer from './container';

type Params = {
  address: string;
  token: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const TradeHistoryPage: React.FC<Props> = (props) => {
  const {
    match: { params },
  } = props;
  const { address, token, networkName } = params;
  const { messages } = useIntl();
  const classes = useStyles();
  const account = useDefaultAccount();
  const history = useHistory();

  useEffect(() => {
    if (account && (account !== address)) {
      if (token) {
        history.push(`/${networkName}/history/trade/list/${account}/token/${token}`)
      } else {
        history.push(`/${networkName}/history/trade/list/${account}`)
      }

    }
  }, [account])


  const { data: tokenData } = useCoingeckoTokenInfo(token, networkName);


  const onSwitchNetwork = (n: EthereumNetwork) => {
    history.push(`/${n}/history/trade/list/${account}`)
  }

  return (
    <Box pt={{ xl: 4 }}>
      {!token && <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: `/dashboard/wallet`, name: 'Wallet' },
          ],
          active: { name: 'Trade History' },
        }}
        title={{ name: `Trade History: ${truncateAddress(address)}`, hasCopy: address }}
        networkSwitcher={{ networkName, onClick: onSwitchNetwork }}
      />}

      {token && <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: `/${networkName}/dashboard/token/${token}`, name: 'Token' },
          ],
          active: { name: 'Trade History' },
        }}
        title={{ name: `Trade History:  ${truncateAddress(address)}`, hasCopy: address }}
      />}

      {(token && tokenData) && (
        <PageTitle
          title={{ name: tokenData.name }}
          subtitle={{ name: truncateAddress(token), hasCopy: token }}
          icon={token}
        />
      )}

      <TradeHistoryContainer address={address} token={token} networkName={networkName}/>
      
    </Box>
  );
};

export default TradeHistoryPage;