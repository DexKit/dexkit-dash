import React from 'react';

import {Box, Fade} from '@material-ui/core';
import AppCard from '../../../../@crema/core/AppCard';
import Sales from 'assets/images/dashboard/sales.svg';
import Revenue from 'assets/images/dashboard/revenue.svg';

interface Props {
  state: {
    id: number;
    type: string;
    value: string;
    bgColor: string;
    icon?: string;
  };
}

const InfoCard: React.FC<Props> = ({state}) => {
  const {bgColor, type, value, id} = state;

  return (
    <Fade in={true} timeout={1000}>
      <AppCard height={1} style={{backgroundColor: bgColor}}>
        <Box display='flex' alignItems='center'>
          <Box mr={5} clone alignSelf='flex-start'>
            <img width='12%' src={id === 1 ? Sales : Revenue} alt='icon' />
          </Box>
          <Box flex={1} fontSize={18} fontWeight='bold' color='#F15A2B'>
            <p>{value}</p>
            {/* <Box mt={0.5}>
              <p style={{fontWeight: 'normal', fontSize: 13}}>{type}</p>
            </Box> */}
          </Box>
        </Box>
      </AppCard>
    </Fade>
  );
};

export default InfoCard;
