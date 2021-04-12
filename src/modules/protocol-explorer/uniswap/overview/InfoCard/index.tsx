import React from 'react';
import {Box, Typography} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import Etherium from 'assets/images/etherium.png';
import { useHistory } from 'react-router-dom';

export interface Props {
  state: {
    id: number;
    type: string;
    value: string;
    bgColor: string;
    icon?: string;
    href?: string;
  }
}

const InfoCard: React.FC<Props> = ({state}) => {
  const { bgColor, value, href } = state;
  const history = useHistory();
  return (
    <AppCard
      onClick={() => history.push(href ?? history.location.pathname)}
      height={1}
      style={{backgroundColor: bgColor, cursor: 'pointer'}}
    >
      <Box display='flex' alignItems='center'>
        <Box mr={3} clone alignSelf='flex-start'>
          <img src={Etherium} alt='icon' />
        </Box>
        <Box flex={1} color='white'>
          <Typography component='h5' variant='inherit' color='inherit'>
            {value}
          </Typography>
         
        </Box>
      </Box>
    </AppCard>
  );
};

export default InfoCard;
