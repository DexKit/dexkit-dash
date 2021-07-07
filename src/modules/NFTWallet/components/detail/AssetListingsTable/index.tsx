import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';

import AssetListingsRow from '../AssetListingsRow';

interface Props {
  listings?: any[];
  onCancel: (listing: any) => void;
  onBuy: (listing: any) => void;
}

export default (props: Props) => {
  const {listings, onCancel, onBuy} = props;

  return (
    <TableContainer>
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
            <AssetListingsRow
              onCancel={onCancel}
              onBuy={onBuy}
              key={index}
              listing={listing}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
