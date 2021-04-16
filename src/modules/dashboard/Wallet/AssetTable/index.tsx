import React from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import CTable from './CTable';
import { MyBalance } from 'types/bitquery/myBalance.interface';


interface AssetTableProps {
  balances: MyBalance[];
}

const AssetTable: React.FC<AssetTableProps> = ({balances}) => {

  return (
    <AppCard
      contentStyle={{paddingLeft: 0, paddingRight: 0,}}
      title="My Assets"
      action={
        <>
        {/* <div>
          <Chip style={{marginRight: 10}} label="All" clickable color="primary" />
          <Chip style={{marginRight: 10}} label="Coins" clickable />
          <Chip label="Token" clickable />
        </div> */}

        {/* <Button style={{textTransform: 'none'}} color="secondary">
          View All
        </Button> */}
        </>
      }>
      <CTable recentPatients={balances} />
    </AppCard>
  );
};

export default AssetTable;
