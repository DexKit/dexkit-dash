import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';
import useFetch from 'use-http';
import moment from 'moment';
import {AssetEventType} from 'opensea-js/lib/types';
import AssetEventTableRow from '../AssetEventTableRow';
import AssetOrdersRow from '../AssetOrdersRow';

interface Props {
  orders: any[];
}

export default (props: Props) => {
  const {orders} = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <IntlMessages id='nfts.detail.ordersPriceHeader' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.ordersUSDPriceHeader' />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.ordersExpirationHeader' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.ordersFromHeader' />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order, index) => (
          <AssetOrdersRow key={index} order={order} />
        ))}
      </TableBody>
    </Table>
  );
};
