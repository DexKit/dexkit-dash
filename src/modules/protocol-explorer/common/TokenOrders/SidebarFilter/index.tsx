import React, {useEffect, useState} from 'react';

import {Box} from '@material-ui/core';

import Divider from '@material-ui/core/Divider';

import {makeStyles} from '@material-ui/core/styles';

import {useDispatch, useSelector} from 'react-redux';
import { Scrollbar } from '@crema';
import { Fonts } from 'shared/constants/AppEnums';



const useStyles = makeStyles({
  divider: {
    marginTop: 16,
  },
});
const SidebarFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
 

  return (
    <Scrollbar className='scroll-app-sidebar'>
      <Box p={6}>
        <Box component='h5' mb={2} fontWeight={Fonts.MEDIUM}>
          Filter By
        </Box>
        <Box color='text.secondary' mb={4} fontWeight={Fonts.MEDIUM}>
          CATEGORIES
        </Box>
       
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          PRICE
        </Box>
     
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          BRAND
          
        </Box>
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          IDEAL FOR
          
        </Box>
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          DISCOUNT
         
        </Box>
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          COLOR
          
        </Box>
        <Divider className={classes.divider} />
        <Box color='text.secondary' my={4} fontWeight={Fonts.MEDIUM}>
          CUSTOMER RATINGS
          
        </Box>
      </Box>
    </Scrollbar>
  );
};

export default SidebarFilter;
