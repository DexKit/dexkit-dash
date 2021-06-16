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

function useAssetEvents() {
  const {get, data, loading} = useFetch(
    'https://api.opensea.io/api/v1/events?asset_contract_address=2421&token_id=234324&only_opensea=false',
  );

  return {};
}

interface Props {
  events: any[];
}

export default (props: Props) => {
  const {events} = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <IntlMessages id='nfts.detail.eventsTypeLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.eventsPriceLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.eventsFromLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.eventsToLabel' />
          </TableCell>
          <TableCell>
            <IntlMessages id='nfts.detail.eventsDateLabel' />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={event.id}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
