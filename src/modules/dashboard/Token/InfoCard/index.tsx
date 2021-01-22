import React from 'react';
import {Box, Typography} from '@material-ui/core';
import AppCard from '../../../../@crema/core/AppCard';
import Etherium from 'assets/images/etherium.png'

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
  const {bgColor, type, value} = state;

  return (
    <AppCard
      height={1}
      style={{backgroundColor: bgColor}}
      className='card-hover'>
      <Box display='flex' alignItems='center'>
        <Box mr={3} clone alignSelf='flex-start'>
          <img src={Etherium} alt='icon' />
        </Box>
        <Box flex={1} color='white'>
          <Typography component='h5' variant='inherit' color='inherit'>
            {value}
          </Typography>
          <Box mt={0.5} component='p'>
            {type}
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default SalesState;
