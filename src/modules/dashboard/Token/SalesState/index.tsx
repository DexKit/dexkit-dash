import React from 'react';
import Box from '@material-ui/core/Box';
import {Fonts} from '../../../../shared/constants/AppEnums';
import GridContainer from '../../../../@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppCard from '../../../../@crema/core/AppCard';
// import {isBreakPointDown} from '../../../../@crema/utility/Utils';
// import AppSelect from '../../../../@crema/core/AppSelect';
import {useIntl} from 'react-intl';
// import AppList from '../../../../@crema/core/AppList';
import Avatar from '@material-ui/core/Avatar';
import Revenue from 'assets/images/dashboard/auther_sales.png'
import SalesIcon from 'assets/images/dashboard/all_time_sales.png'
import Comission from 'assets/images/dashboard/commission_sale.png'


// import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export interface SalesStateData {
  id: number;
  amount: string;
  type: string;
  icon: string;
}

interface SalesStateProps {
  salesState: SalesStateData[];
}

const SalesState: React.FC<SalesStateProps> = ({salesState}) => {
  // const handleSelectionType = (data: any) => {
  //   console.log('data: ', salesState);
  // };
  // const getData = (data: SalesStateData[]) => {
  //   if (isBreakPointDown('md')) {
  //     return data.slice(0, 4);
  //   } else if (isBreakPointDown('xl')) {
  //     return data.slice(0, 3);
  //   } else {
  //     return data;
  //   }
  // };
  const {messages} = useIntl();
  console.log('data: ', salesState);

  return (
    <AppCard
      title={messages['dashboard.analytics.drState']}
      height={1}
      >
   
      <GridContainer style={{marginTop: 20}}>
        <Grid style={{padding: 0}} item xs={12} sm={6}>
        <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
                <Box
                  key={'drState-' + 'item.id'}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={SalesIcon}
                    alt='icon'
                    style={{height: 38, width: 38}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h4'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      style={{padding: 0}}
                      mb={0.5}
                      fontSize={13}>
                      $3.2M
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={11}>
                      Marked Cap
                    </Box>
                  </Box>
                </Box>
          </Box>
        </Grid>
        <Grid style={{padding: 0}} item xs={12} sm={6}>
        <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
                <Box
                  key={'drState-' + 'item.id'}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={Revenue}
                    alt='icon'
                    style={{height: 38, width: 38}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h4'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      style={{padding: 0}}
                      mb={0.5}
                      fontSize={13}>
                      $908.23
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={11}>
                     1 year Low
                    </Box>
                  </Box>
                </Box>
          </Box>
        </Grid>
        <Grid style={{padding: 0}} item xs={12} sm={6}>
        <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
                <Box
                  key={'drState-' + 'item.id'}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={Comission}
                    alt='icon'
                    style={{height: 38, width: 38}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h4'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      style={{padding: 0}}
                      mb={0.5}
                      fontSize={13}>
                      $3.2M
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={11}>
                      24 Hour Volume
                    </Box>
                  </Box>
                </Box>
          </Box>
        </Grid>
        <Grid style={{padding: 0}} item xs={12} sm={6}>
        <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
                <Box
                  key={'drState-' + 'item.id'}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={Revenue}
                    alt='icon'
                    style={{height: 38, width: 38}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h4'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      style={{padding: 0}}
                      mb={0.5}
                      fontSize={13}>
                      $43.58k
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={11}>
                      1 Year High
                    </Box>
                  </Box>
                </Box>
          </Box>
        </Grid>
        
      </GridContainer>
    </AppCard>
  );
};
export default SalesState;
