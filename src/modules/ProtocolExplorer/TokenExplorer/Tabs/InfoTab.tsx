import React from 'react';
import GridContainer from '@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
import ErrorView from 'modules/Common/ErrorView';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import CoingeckoProfile from 'modules/Dashboard/Token/CoingeckoProfile';
import CoingeckoMarket from 'modules/Dashboard/Token/CoingeckoMarket';

type Props = {
  address: string;
  networkName: EthereumNetwork;
};

export const InfoTab = (props: Props) => {
  const {address, networkName} = props;
  const {loading, error, data} = useCoingeckoTokenInfo(address, networkName);
  return (
    <GridContainer style={{marginTop: 15}}>
      <Grid item xs={12} sm={6} md={6}>
        {error ? (
          <ErrorView message={error.message} />
        ) : (
          <CoingeckoProfile data={data} loading={loading} />
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        {error ? (
          <ErrorView message={error.message} />
        ) : (
          <CoingeckoMarket data={data} loading={loading} />
        )}
      </Grid>
    </GridContainer>
  );
};
