import React from 'react';
import {useIntl} from 'react-intl';
import {useTokenInfo} from 'hooks/protocolExplorer/useTokenInfo';
import {Box, Card, Grid} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';

interface Props {
  address: string;
}

const TokenInfo: React.FC<Props> = (props) => {
  const {address} = props;
  const {messages} = useIntl();
  const {loading, error, data} = useTokenInfo({address});

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
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
            {loading ? (
              <LoadingView />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              <>
                {data?.ethereum?.address.map((e) => (
                  <Grid container>
                    <Grid item xs={12}>
                      <Box
                        mb={2}
                        component='h3'
                        fontFamily={Fonts.LIGHT}
                        fontSize={{xs: 20, sm: 22, xl: 24}}>
                        {e.smartContract?.currency?.name}
                      </Box>
                    </Grid>
                    {e.annotation && (
                      <Grid item xs={12}>
                        <Box
                          mb={3}
                          component='div'
                          fontSize={{xs: 12, sm: 13, xl: 14}}
                          whiteSpace='wrap'
                          textAlign='justify'
                          fontWeight={700}
                          lineHeight={1.2}>
                          {e.annotation}
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={4}>
                      <Box
                        component='strong'
                        fontSize={{xs: 14, sm: 16, xl: 18}}
                        whiteSpace='nowrap'>
                        {e.smartContract?.currency?.symbol}
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
                        {e.smartContract?.currency?.tokenType || '-'}
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
                        {e.smartContract?.currency?.decimals}
                      </Box>
                      <Box
                        component='div'
                        fontSize={{xs: 12, sm: 13, xl: 14}}
                        whiteSpace='nowrap'>
                        {messages['app.numberOfDecimals']}
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default TokenInfo;
