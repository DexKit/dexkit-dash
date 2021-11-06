import React from 'react';

import {useIntl} from 'react-intl';

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AppCard from '@crema/core/AppCard';
import {Box, Typography} from '@material-ui/core';
import IntlMessages from '../../../@crema/utility/IntlMessages';

interface Props {
  value: number | undefined | null;
}

const AffiliateRevenue = (props: Props) => {
  const {value} = props;
  const {messages} = useIntl();

  return (
    <AppCard style={{backgroundColor: 'primary'}} className='card-hover'>
      <Box display='flex' alignItems='center'>
        <Box mr={3} clone alignSelf='flex-start'>
          <MonetizationOnIcon style={{color: 'white'}} />
        </Box>
        <Box flex={1} color='white'>
          <Typography component='h3' variant='inherit' color='inherit'>
            {value && value.toFixed(3)} $
          </Typography>
          <Box mt={0.5} component='p'>
            <IntlMessages id='app.affiliate.revenue.title' />
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default AffiliateRevenue;
