import React from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import AppMenu from '../../../../@crema/core/AppMenu';
import AppList from '../../../../@crema/core/AppList';
import DoctorCell from './DoctorCell';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import {TopDoctorData} from '../../../../types/models/HealthCare';

interface TopDoctorsProps {
  data: TopDoctorData[];
}

const TopDoctors: React.FC<TopDoctorsProps> = ({data}) => {
  return (
    <AppCard
      title="Kit Market"
      contentStyle={{paddingLeft: 0, paddingRight: 0}}
      action={<AppMenu />}>
      <Scrollbar style={{maxHeight: 280}}>
        <AppList
          data={data}
          renderRow={doctor => <DoctorCell key={doctor.id} doctor={doctor} />}
        />
      </Scrollbar>
    </AppCard>
  );
};

export default TopDoctors;
