import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { CustomTab, CustomTabs } from 'shared/components/Tabs/CustomTabs';
import TradeHistoryContainer from 'modules/History/TradeHistory/container';
import { MyOrdersTab } from './Tabs/MyOrdersTab';
import {EthereumNetwork} from 'shared/constants/AppEnums';


type HistoryTablesProps = {
  address: string;
  networkName: EthereumNetwork;
  account?: string;
};

export const useStyles = makeStyles(() => ({
  tabsContainer: {
    width: '350px',
  },
}))


const HistoryTables: React.FC<HistoryTablesProps> = ({ address, networkName, account }) => {
  const [tableActive, setTableActive] = useState<number>(0)
  const onChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => setTableActive(newValue)
  const classes = useStyles();

  return (
    <>
      <CustomTabs
        className={classes.tabsContainer}
        TabIndicatorProps={{ style: { display: 'none' } }}
        value={tableActive}
        onChange={onChangeTab}
        variant='standard'>
        <CustomTab label={"Open Orders"} />
        <CustomTab label={"Trade"} />
      </CustomTabs>
      {tableActive == 0 && <MyOrdersTab address={address} networkName={networkName} />}
      {
        tableActive == 1 && (
          <TradeHistoryContainer
            address={account as string}
            token={address}
            networkName={networkName}
          />
        )
      }
    </>
  )
}

export default HistoryTables;