import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';

import AssetOffersTableRow from './AssetOffersTableRow';

interface Props {
  offers?: any[];
  asset?: any;
  onCancel: (offer: any) => void;
  onAccept: (offer: any) => void;
}

export default (props: Props) => {
  const {offers, asset, onCancel, onAccept} = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <IntlMessages id='nfts.detail.offersPriceHeader' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.offersUSDPriceHeader' />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.offersExpirationHeader' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.offersFromHeader' />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {offers?.map((offer, index) => (
          <AssetOffersTableRow
            key={index}
            offer={offer}
            onCancel={onCancel}
            onAccept={onAccept}
            asset={asset}
          />
        ))}
      </TableBody>
    </Table>
  );
};
