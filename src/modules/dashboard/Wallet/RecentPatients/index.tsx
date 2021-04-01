import React from 'react';
// import Chip from '@material-ui/core/Chip';
// import Button from '@material-ui/core/Button';
import AppCard from '../../../../@crema/core/AppCard';
import PatientsTable from './PatientsTable';
import { MyBalance } from 'types/bitquery/myBalance.interface';

interface RecentPatientsProps {
  recentPatients: MyBalance[];
}

const RecentPatients: React.FC<RecentPatientsProps> = ({recentPatients}) => {

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
      <PatientsTable recentPatients={recentPatients} />
    </AppCard>
  );
};

export default RecentPatients;
