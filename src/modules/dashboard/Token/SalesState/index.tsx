import React from 'react';
import Box from '@material-ui/core/Box';
import {Fonts} from '../../../../shared/constants/AppEnums';
import GridContainer from '../../../../@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppCard from '../../../../@crema/core/AppCard';
import {isBreakPointDown} from '../../../../@crema/utility/Utils';
// import AppSelect from '../../../../@crema/core/AppSelect';
import {useIntl} from 'react-intl';
import AppList from '../../../../@crema/core/AppList';
import Avatar from '@material-ui/core/Avatar';

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
  const getData = (data: SalesStateData[]) => {
    if (isBreakPointDown('md')) {
      return data.slice(0, 4);
    } else if (isBreakPointDown('xl')) {
      return data.slice(0, 3);
    } else {
      return data;
    }
  };
  const {messages} = useIntl();
  console.log('data: ', salesState);

  return (
    <AppCard
      title={messages['dashboard.analytics.drState']}
      height={1}
     
      >
    
      <GridContainer>
        <Grid item xs={12} sm={6}>
        <Box
            width={1}
            ml={2}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <AppList
              animation='transition.slideRightBigIn'
              delay={200}
              duration={400}
              data={getData(salesState)}
              renderRow={item => (
                <Box
                  key={'drState-' + item.id}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={item.icon}
                    alt='icon'
                    style={{height: 48, width: 48}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h3'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      mb={0.5}
                      fontSize={16}>
                      ${item.amount}
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={14}>
                      {item.type}
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            width={1}
            ml={2}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <AppList
              animation='transition.slideRightBigIn'
              delay={200}
              duration={400}
              data={getData(salesState)}
              renderRow={item => (
                <Box
                  key={'drState-' + item.id}
                  pl={{xl: 6}}
                  py={2}
                  display='flex'
                  alignItems='center'>
                  <Avatar
                    src={item.icon}
                    alt='icon'
                    style={{height: 48, width: 48}}
                  />

                  <Box position='relative' ml={4}>
                    <Box
                      component='h3'
                      display='inline-block'
                      fontWeight={Fonts.BOLD}
                      mb={0.5}
                      fontSize={16}>
                      ${item.amount}
                    </Box>
                    <Box component='p' color='text.secondary' fontSize={14}>
                      {item.type}
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Grid>
      </GridContainer>
    </AppCard>
  );
};
export default SalesState;
