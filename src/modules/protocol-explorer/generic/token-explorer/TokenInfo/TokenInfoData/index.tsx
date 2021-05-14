import React from 'react';
import {Box, Card, Grid} from '@material-ui/core';
import {indigo} from '@material-ui/core/colors/index';
import {Token} from 'types/app';
import {useIntl} from 'react-intl';
import {Fonts} from 'shared/constants/AppEnums';
import TokenLogo from 'shared/components/TokenLogo';

interface Props {
  data: Token | undefined;
}

const TokenInfoData: React.FC<Props> = ({data}) => {
  const {messages} = useIntl();

  return (
    <>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{height: '100%'}}
        clone>
        <Card>
          <Box
            display='flex'
            flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}>
            {data ? (
              <Grid container>
                <Grid item xs={12}>
                   <Box  display='flex'  alignItems={'center'} mb={2}> 
                    <TokenLogo token0={data.address}></TokenLogo>
                    <Box
                      component='h3'
                      pl={2}
                      fontFamily={Fonts.LIGHT}
                      fontSize={{xs: 20, sm: 22, xl: 24}}>   
                      {data.name}
                    </Box>
                  </Box>
                </Grid>
                {data.annotation && (
                  <Grid item xs={12}>
                    <Box
                      mb={3}
                      component='div'
                      fontSize={{xs: 12, sm: 13, xl: 14}}
                      whiteSpace='wrap'
                      textAlign='justify'
                      fontWeight={700}
                      lineHeight={1.2}>
                      {data.annotation}
                    </Box>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <Box
                    component='strong'
                    fontSize={{xs: 14, sm: 16, xl: 18}}
                    whiteSpace='nowrap'>
                    {data.symbol}
                  </Box>
                  <Box
                    component='div'
                    fontSize={{xs: 12, sm: 13, xl: 14}}
                    whiteSpace='nowrap'>
                    {messages['app.symbol']}
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    component='strong'
                    fontSize={{xs: 14, sm: 16, xl: 18}}
                    whiteSpace='nowrap'>
                    {data.type || '-'}
                  </Box>
                  <Box
                    component='div'
                    fontSize={{xs: 12, sm: 13, xl: 14}}
                    whiteSpace='nowrap'>
                    {messages['app.tokenType']}
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    component='strong'
                    fontSize={{xs: 14, sm: 16, xl: 18}}
                    whiteSpace='nowrap'>
                    {data.decimals}
                  </Box>
                  <Box
                    component='div'
                    fontSize={{xs: 12, sm: 13, xl: 14}}
                    whiteSpace='nowrap'>
                    {messages['app.numberOfDecimals']}
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box
                component='h3'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 20, sm: 22, xl: 24}}>
                Loading...
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default TokenInfoData;
