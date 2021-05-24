import React from 'react';
import Box from '@material-ui/core/Box';
import {Fonts} from 'shared/constants/AppEnums';
import IconButton from '@material-ui/core/IconButton';
import GridContainer from '../../../../@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppCard from '../../../../@crema/core/AppCard';
import { SalesStateData} from '../../../../types/models/Analytics';
import Etherium from 'assets/images/etherium.png'


interface SalesStateProps {
  salesState: SalesStateData[];
}
  // {
  //   id: number;
  //   amount: string;
  //   type: string;
  //   icon: string;
  // }

const SalesState: React.FC<SalesStateProps> = ({salesState}) => {

  return (
    <AppCard
      height={1}
    >
      <GridContainer>
        <Grid item xs={12} sm={12}>
          <Box
            width={1}
            ml={2}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            {salesState.map((item: SalesStateData, index: number) => (
              <Box
                key={'salesState-' + index}
                pl={{xl: 6}}
                display='flex'
                alignItems='center'>
                <Box p={3} fontSize={{xs: 30, md: 48}} clone>
                  <IconButton size='medium'>
                    <img style={{backgroundColor: 'blue', maxWidth: 50}} alt='' src={Etherium} />
                  </IconButton>
                </Box>

                <Box position='relative' ml={{xs: 3, xl: 6}}>
                  <Box
                    component='h3'
                    display='inline-block'
                    fontFamily={Fonts.LIGHT}
                    mb={1}
                    fontSize={{xs: 18, sm: 20, xl: 22}}>
                    ${item.amount}
                  </Box>
                  <Box
                    component='p'
                    color='grey.500'
                    fontSize={{xs: 16, xl: 18}}>
                    {item.type}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </GridContainer>
    </AppCard>
  );
};
export default SalesState;
