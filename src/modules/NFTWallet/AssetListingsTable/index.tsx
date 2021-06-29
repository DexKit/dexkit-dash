import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';

import AssetListingsRow from '../AssetListingsRow';

interface Props {
  listings?: any[];
}

export default (props: Props) => {
  const {listings} = props;

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
        {listings?.map((listing: any, index: number) => (
          <AssetListingsRow key={index} listing={listing} />
        ))}
      </TableBody>
    </Table>
  );
};
