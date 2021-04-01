import React from 'react';
import Button from '@material-ui/core/Button';
import AppCard from '../../../../../@crema/core/AppCard';
import PatientsTable from './PatientsTable';
import {RecentPatientData} from '../../../../../types/models/HealthCare';

interface RecentPatientsProps {
  recentPatients: RecentPatientData[];
}

const RecentPatients: React.FC<RecentPatientsProps> = ({recentPatients}) => {

  return (
    <AppCard
      contentStyle={{paddingLeft: 0, paddingRight: 0,}}
      title="Hot Pairs"
      action={
        <>
      <Button style={{textTransform: 'none'}}  color="secondary">
        View All
      </Button>
        </>
      }>
      <PatientsTable recentPatients={recentPatients} />
    </AppCard>
  );
};

export default RecentPatients;
