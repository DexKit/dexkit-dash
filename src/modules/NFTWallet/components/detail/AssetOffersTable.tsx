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
}

export default (props: Props) => {
  const {offers} = props;

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
          <AssetOffersTableRow key={index} offer={offer} />
        ))}
      </TableBody>
    </Table>
  );
};
