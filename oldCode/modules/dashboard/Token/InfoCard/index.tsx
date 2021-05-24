import React from 'react';
import {Box} from '@material-ui/core';
import AppCard from '../../../../@crema/core/AppCard';
import Etherium from 'assets/images/dashboard/sales.svg'
import Revenue from 'assets/images/dashboard/revenue.svg'

export interface SalesStateProps {
  state: {
    id: number;
    type: string;
    value: string;
    bgColor: string;
    icon?: string;
  }
}

const SalesState: React.FC<SalesStateProps> = ({state}) => {
  const {bgColor, type, value, id} = state;
  console.log('id', id)

  return (
    <AppCard
      height={1}
      style={{backgroundColor: bgColor}}
      className='card-hover'>
      <Box display='flex' alignItems='center'>
        <Box mr={3} clone alignSelf='flex-start'>
          <img width="20%" src={id === 1 ? Etherium : Revenue} alt='icon' />
        </Box>
        <Box flex={1} fontSize={14} fontWeight="bold"color='white'>
            <p>{value}</p>
          <Box mt={0.5}  >
            <p style={{fontWeight: 'normal', fontSize: 13}}>{type}</p>
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default SalesState;
