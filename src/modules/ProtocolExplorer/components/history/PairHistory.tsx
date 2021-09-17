import React, {useState} from 'react';
import {Box, Chip, makeStyles, Typography} from '@material-ui/core';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import {IS_AMM} from 'utils';
import AMMTradeHistory from 'modules/ProtocolExplorer/Common/AMMTradeHistory';
import AMMPoolHistory from 'modules/ProtocolExplorer/Common/AMMPoolHistory';
import Grid from '@material-ui/core/Grid';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
type PairHistoryTablesProps = {
  networkName: EthereumNetwork;
  pair: GetTokenPairs_ethereum_dexTrades;
};

export const useStyles = makeStyles(() => ({
  historyContainer: {
    width: '100%',
  },
}));

const enum HistoryStateEnum {
  Trade = 'Trade',
  Pool = 'Pool',
}

const PairHistoryTables: React.FC<PairHistoryTablesProps> = ({
  networkName,
  pair,
}) => {
  const [historyState, setHistoryState] = useState(HistoryStateEnum.Trade);
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const title = `${GET_EXCHANGE_NAME(
    pair.exchange?.fullName as EXCHANGE,
  )}: ${pair.baseCurrency?.symbol?.toUpperCase()}/${pair.quoteCurrency?.symbol?.toUpperCase()}`;

  return (
    <Box mt={2}>
      {IS_AMM(pair?.exchange?.fullName as EXCHANGE, pair?.protocol) ? (
        <Grid container alignItems='center' spacing={2}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems='center'
              justify='space-between'
              spacing={2}>
              <Grid item xs={isMobile ? 12 : undefined}>
                <Typography variant='h5'>{title}</Typography>
              </Grid>
              <Grid item xs={isMobile ? 12 : undefined}>
                <Box pt={{xs: 2, sm: 0}}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Chip
                        label='Trade History'
                        clickable
                        variant={
                          historyState === HistoryStateEnum.Trade
                            ? 'default'
                            : 'outlined'
                        }
                        onClick={() => setHistoryState(HistoryStateEnum.Trade)}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        label='Pool History'
                        clickable
                        variant={
                          historyState === HistoryStateEnum.Pool
                            ? 'default'
                            : 'outlined'
                        }
                        onClick={() => setHistoryState(HistoryStateEnum.Pool)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {historyState === HistoryStateEnum.Trade && (
              <AMMTradeHistory
                address={pair?.smartContract?.address.address as string}
                networkName={networkName}
                exchange={pair?.exchange?.fullName as EXCHANGE}
              />
            )}

            {historyState === HistoryStateEnum.Pool && (
              <AMMPoolHistory
                address={pair?.smartContract?.address.address as string}
                networkName={networkName}
                exchange={pair?.exchange?.fullName as EXCHANGE}
                baseCurrency={pair?.baseCurrency as any}
                quoteCurrency={pair?.quoteCurrency as any}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems='center' spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h5'>{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TokenOrders
              baseAddress={pair.baseCurrency?.address as string}
              quoteAddress={pair.quoteCurrency?.address as string}
              networkName={networkName}
              type={'pair'}
              exchange={pair?.exchange?.fullName as EXCHANGE}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PairHistoryTables;
