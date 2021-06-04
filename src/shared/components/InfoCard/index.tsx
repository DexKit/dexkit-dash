import React from 'react';
import {Box, Fade, Typography} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import Trade from 'assets/images/dashboard/trade.svg';
import History from 'assets/images/dashboard/history.svg';
import {useHistory} from 'react-router-dom';

export interface Props {
  icon?: string | JSX.Element;
  state: {
    id: number;
    type: string;
    value: string;
    bgColor: string;
    icon?: string | JSX.Element;
    href?: string;
  };
}

const InfoCard: React.FC<Props> = ({state}) => {
  const {bgColor, value, href, id} = state;
  const history = useHistory();
  return (
    <Fade in={true} timeout={1000}>
      <AppCard
        onClick={() => history.push(href ?? history.location.pathname)}
        height={1}
        style={{backgroundColor: bgColor, cursor: 'pointer'}}>
        <Box display='flex' alignItems='center'>
          <Box mr={3} clone alignSelf='flex-start'>
          <img width='12%' src={id === 1 ? History : Trade } alt='icon' />
          </Box>
          <Box flex={1} color='#F15A2B'>
            <Typography component='h5' variant='inherit' color='inherit'>
              {value}
            </Typography>
          </Box>
        </Box>
      </AppCard>
    </Fade>
  );
};

export default InfoCard;
