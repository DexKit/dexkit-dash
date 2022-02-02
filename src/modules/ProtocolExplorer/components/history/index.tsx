import React, {useState} from 'react';

import {useIntl} from 'react-intl';

import {makeStyles} from '@material-ui/core';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import PairHistory from './PairHistory';

type HistoryTablesProps = {
  address: string;
  networkName: EthereumNetwork;
  pair?: GetTokenPairs_ethereum_dexTrades;
  account?: string;
};

export const useStyles = makeStyles(() => ({
  tabsContainer: {
    width: '350px',
  },
  historyContainer: {
    width: '100%',
  },
  mobileTabsContainer: {
    width: '100%',
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
  },
}));

const HistoryTables: React.FC<HistoryTablesProps> = ({
  address,
  networkName,
  account,
  pair,
}) => {
  const [tableActive, setTableActive] = useState<number>(0);
  const onChangeTab = (event: React.ChangeEvent<{}>, newValue: number) =>
    setTableActive(newValue);
  const {mobileTabsContainer, tabsContainer} = useStyles();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const {messages} = useIntl();

  return (
    <>
      <CustomTabs
        className={isMobile ? mobileTabsContainer : tabsContainer}
        TabIndicatorProps={{style: {display: 'none'}}}
        value={tableActive}
        onChange={onChangeTab}
        variant='standard'>
        <CustomTab label={messages['app.protocolExplorer.history'] as string} />
        <CustomTab label={messages['app.protocolExplorer.pairs'] as string} />
      </CustomTabs>
      {tableActive === 0 && (
        <TokenOrders
          baseAddress={address}
          quoteAddress={null}
          networkName={networkName}
          type={'token'}
          exchange={EXCHANGE.ALL}
        />
      )}
      {tableActive === 1 && pair && (
        <PairHistory networkName={networkName} pair={pair} />
      )}
    </>
  );
};

export default HistoryTables;
