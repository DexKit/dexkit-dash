import React, {useState} from 'react';
import {makeStyles, Paper} from '@material-ui/core';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';

type HistoryTablesProps = {
  address: string;
  networkName: EthereumNetwork;
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
}) => {
  const [tableActive, setTableActive] = useState<number>(0);
  const onChangeTab = (event: React.ChangeEvent<{}>, newValue: number) =>
    setTableActive(newValue);
  const {mobileTabsContainer, tabsContainer} = useStyles();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <>
      <CustomTabs
        className={isMobile ? mobileTabsContainer : tabsContainer}
        TabIndicatorProps={{style: {display: 'none'}}}
        value={tableActive}
        onChange={onChangeTab}
        variant='standard'>
        <CustomTab label={'History'} />
        <CustomTab label={'Pairs'} />
      </CustomTabs>


      {tableActive == 0 && (
        <TokenOrders baseAddress={address} quoteAddress={null} networkName={networkName} type={'token'} exchange={EXCHANGE.ALL}/>
      )}
      {tableActive == 1 && (
        <> </>
      )}
    </>
  );
};

export default HistoryTables;