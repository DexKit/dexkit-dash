import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
} from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import React from 'react';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import CoingeckoMarket from '../CoingeckoMarket';
import CoingeckoProfile from '../CoingeckoProfile';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type Props = {
  error: any;
  data: CoinDetailCoinGecko | undefined;
  loading: boolean;
};

export const InfoTab = (props: Props) => {
  const {error, data, loading} = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {data?.name} ({data?.symbol.toUpperCase()})
      </AccordionSummary>
      <AccordionDetails>
        {error ? (
          <ErrorView message={error.message} />
        ) : (
          <>
            <CoingeckoProfile data={data} loading={loading} />
            <CoingeckoMarket data={data} loading={loading} />
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
