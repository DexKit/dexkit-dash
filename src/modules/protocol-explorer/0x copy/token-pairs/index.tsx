import React, { useState } from 'react';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';

import { useQuery } from '@apollo/client';

import { Loader } from '@crema';
import AppCard from '@crema/core/AppCard';
import { useIntl } from 'react-intl';
import { useStyles } from './index.style';

import { BITQUERY_TOKEN_PAIRS } from 'services/graphql/bitquery/protocol/gql';
import { Link } from 'react-router-dom';
import { useWeb3 } from 'hooks/useWeb3';
import { GET_NETWORK_NAME, EXCHANGE } from 'shared/constants/Bitquery';
import { TokenPair } from 'types/bitquery/protocol';
import { client } from 'services/graphql/bitquery';


type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
  align?: 'left' | 'right';
  isSort: boolean;
}

const headCells: HeadCell[] = [
  { id: 'pair', label: 'Pair', isSort: false },
  { id: 'price', align: 'left', label: 'Price', isSort: false },
  { id: 'baseAmount24', align: 'left', label: 'Base Amount (24hrs)', isSort: false },
  { id: 'quoteAmount24', align: 'left', label: 'Quote Amount (24hrs)', isSort: false },
  { id: 'trades', align: 'left', label: 'Trades (24hrs)', isSort: false },
  { id: 'priceUSD', align: 'left', label: 'Price', isSort: false },
];

const ZRXProtocolTokenPairs = ({address}: {address: string}) => {
  const {chainId} = useWeb3();
  const [orderBy, setOrderBy] = useState<string>('totalLiquidityUSD');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');

  const { loading, error, data } = useQuery<{ tokenPairs: TokenPair[] }>(BITQUERY_TOKEN_PAIRS, {
    variables: {network: GET_NETWORK_NAME(chainId), exchangeName: EXCHANGE.ZEROX, baseAddress: address, from: new Date(new Date().getTime()-24*60*60*1000), limit: 10 },
    client: client
  });
  
  const { messages } = useIntl();


  const handleSort = (property: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

 
  const classes = useStyles();

  return (
    <>
        <Box pt={{ xl: 4 }} clone>
          <GridContainer>
            <Grid item xs={11} md={11}>
              <AppCard
                height={1}
                title={messages['app.topPairs']}
               >
                <Box className={classes.tableResponsiveMaterial}>
                  <Table className='table'>
                    <TableHead>
                      <TableRow className={classes.tableRowRoot}>
                        {headCells.map(h => (
                          <TableCell align={h.align} className={classes.tableCellRoot}>
                            {h.isSort && <TableSortLabel
                              active={orderBy === h.id}
                              direction={orderBy === h.id ? orderDirection : 'asc'}
                              onClick={handleSort(h.id)}
                            >
                              {h.label}
                            </TableSortLabel>}
                            {!h.isSort && h.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { data ? data.tokenPairs.map((data, id) => (
                          <TableRow key={id}>
                            <TableCell component='th' scope='row' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                              <Box className={classes.anchar}><Link to={`/protocol-explorer/0x-protocol/pair-explorer/${data.baseCurrency.address}-${data.quoteCurrency.address}`}>{data.baseCurrency.symbol}/{data.quoteCurrency.symbol}</Link></Box>
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              ${(data.baseAmount/data.baseAmountInUsd).toFixed(3)}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              {data.baseAmount.toFixed(3)}
                            </TableCell>
                            <TableCell
                              align='left'
                              className={classes.tableCell}>
                              ${data.quoteAmount.toFixed(3)}
                            </TableCell>
                            <TableCell
                              align='left'
                              className={classes.tableCell}>
                              ${data.tradeAmountInUsd.toFixed(3)}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              <Box
                                className={classes.badgeRoot}>
                                  {data.trades}
                              </Box>
                            </TableCell>
                          </TableRow>)) : 
                            loading ? <Loader /> : null               
                          }
                    </TableBody>
                  </Table>
                </Box>
              </AppCard>
            </Grid>

          </GridContainer>
        </Box>

      {/*error ? JSON.stringify(error) : null*/}

      <InfoView />
    </>
  );
};


export default ZRXProtocolTokenPairs;