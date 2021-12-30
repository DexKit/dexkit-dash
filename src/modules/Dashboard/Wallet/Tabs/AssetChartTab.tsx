import React from 'react';

import {Box, Divider, Fade, Grid} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
import {useBalanceChart} from 'hooks/balance/useBalanceChart';
import ErrorView from 'modules/Common/ErrorView';
import SelectCoin from 'shared/components/SelectCoin';
import Transak from 'shared/components/Transak';
import {isNativeCoinFromNetworkName} from 'utils';
import AssetChart from '../AssetChart';
import {MyBalances} from 'types/blockchain';

type Props = {
  data: MyBalances[];
  loading: boolean;
};

export const AssetChartTab = (props: Props) => {
  const {data, loading} = props;

  const {
    loading: loadingChart,
    error: errorChart,
    data: dataChart,
    selectToken,
    handleSelectDay,
    handleSelectToken,
  } = useBalanceChart(data);

  return (
    <Grid container direction='row' justify='center' alignItems='center'>
      <Grid item xs={12} md={8} style={{paddingLeft: 0, paddingRight: 0}}>
        <Fade in={true} timeout={1000}>
          {loading && loadingChart ? (
            <Skeleton variant='rect' width='100%' height={350} />
          ) : errorChart && !dataChart.length ? (
            <ErrorView message={errorChart.message} />
          ) : (
            <AppCard style={{paddingLeft: 0, paddingRight: 0, paddingTop: 5}}>
              <Box
                paddingLeft='5px'
                paddingRight='5px'
                display='flex'
                justifyContent={'space-between'}>
                {selectToken && (
                  <SelectCoin
                    menus={data.map((e) => {
                      return {
                        symbol: e.currency?.symbol ?? '',
                        address: e.currency?.address ?? '',
                      };
                    })}
                    defaultValue={selectToken}
                    onChange={(e) => {
                      // NOTE: Search
                      const findToken = data.find(
                        (t) =>
                          (t.currency?.address?.toLowerCase() ??
                            t.currency?.symbol.toLowerCase()) ===
                          e.toLowerCase(),
                      );
                      if (findToken) {
                        const tokenAddress = isNativeCoinFromNetworkName(
                          findToken.currency?.symbol ?? '',
                          findToken.network,
                        )
                          ? findToken.currency?.symbol.toUpperCase()
                          : findToken.currency?.address;
                        if (tokenAddress) {
                          handleSelectToken(tokenAddress, findToken.network);
                        }
                      }
                    }}
                  />
                )}

                <AppSelect
                  menus={[
                    '7 days',
                    '15 days',
                    '30 days',
                    '60 days',
                    '90 days',
                    '180 days',
                  ]}
                  defaultValue={'7 days'}
                  onChange={(e) => {
                    handleSelectDay(Number(e.split(' ')[0]));
                  }}
                />

                <Transak />
              </Box>

              <Divider style={{marginTop: 5}} />

              <Box>
                <Grid item xs={12} md={12} xl={12} style={{padding: 10}}>
                  <AssetChart data={dataChart} />
                </Grid>
              </Box>
            </AppCard>
          )}
        </Fade>
      </Grid>
    </Grid>
  );
};
