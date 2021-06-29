import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';

import {Skeleton} from '@material-ui/lab';

interface Props {}

export default (props: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <IntlMessages id='nfts.detail.historicTypeLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.historicPriceLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.historicFromLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.historicToLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.historicDateLabel' />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
