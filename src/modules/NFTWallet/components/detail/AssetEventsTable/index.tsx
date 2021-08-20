import React from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  useTheme,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';
import useFetch from 'use-http';
import moment from 'moment';
import {AssetEventType} from 'opensea-js/lib/types';
import AssetEventTableRow from '../AssetEventTableRow';
import {Scrollbar} from '@crema';

interface Props {
  events: any[];
}

export default (props: Props) => {
  const {events} = props;
  const theme = useTheme();

  return (
    <TableContainer>
      <Table stickyHeader>
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

        <TableBody
          component={Scrollbar}
          style={{
            maxHeight: theme.spacing(100),
          }}>
          {events.map((event, index) => (
            <AssetEventTableRow key={index} event={event} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
