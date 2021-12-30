import React from 'react';


import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import { CoinDetailCoinGecko } from 'types/coingecko/coin.interface';
import CoingeckoMarket from '../CoingeckoMarket';
import CoingeckoProfile from '../CoingeckoProfile';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Skeleton } from '@material-ui/lab';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

type Props = {
  error: any;
  data: CoinDetailCoinGecko | undefined;
  loading: boolean;
};

export const InfoTab = (props: Props) => {
  const { error, data, loading } = props;

  const theme = useTheme();


  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {loading ? (
          <Skeleton width={theme.spacing(16)} />
        ) : (
          <>
            <IntlMessages id='app.dashboard.about' /> {data?.name} (
            {data?.symbol?.toUpperCase()})
          </>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {error ? (
          <ErrorView message={error.message} />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CoingeckoProfile data={data} loading={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CoingeckoMarket data={data} loading={loading} />
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
