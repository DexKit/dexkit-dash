import {toTokenUnitAmount} from '@0x/utils';
import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import moment from 'moment';

const getEventTypeKey = (eventType: string) => {
  switch (eventType) {
    case 'created':
      return '';
    case 'transfer':
      return '';
    case 'successful':
      return '';
    case '':
      return '';
    default:
      return '';
  }
};

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  event: any;
}

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const EVENT_OFFER = 'offer';
const EVENT_LISTING = 'listing';
const EVENT_CREATED = 'created';

function getEventType(event: any) {
  let is_transfer_event = event.event_type == 'transfer';
  let is_created_event = event.event_type == 'created';
  let is_offer_event = event.event_type == 'offer_entered';

  let is_from_null_address = event.from_account?.address == NULL_ADDRESS;

  let is_to_owner = event.to_account?.address == event.asset.owner.address;
  let has_starting_price = event.starting_price != null;

  let is_dutch_auction = event.auction_type == 'dutch';

  console.log(
    is_from_null_address,
    is_created_event,
    is_to_owner,
    has_starting_price,
  );

  if (is_from_null_address && is_transfer_event) {
    return EVENT_CREATED;
  }

  if (is_created_event && has_starting_price) {
    return EVENT_LISTING;
  }

  if (is_offer_event) {
    return EVENT_OFFER;
  }

  return '';
}

function deriveUserFromAddr(address?: string) {
  return address?.slice(2, 8).toUpperCase();
}

export default (props: Props) => {
  const {event} = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>{getEventType(event)}</TableCell>
      <TableCell>
        {getEventType(event) == EVENT_CREATED ? null : (
          <Grid alignItems='center' alignContent='center' container spacing={2}>
            <Grid item>
              <Tooltip title={event.payment_token?.symbol} aria-label='add'>
                <Avatar
                  className={classes.tokenImageSmall}
                  src={event.payment_token?.image_url as string}
                />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography>
                {toTokenUnitAmount(
                  getEventType(event) == EVENT_OFFER
                    ? event.bid_amount
                    : event.starting_price,
                  event.payment_token?.decimals,
                ).toNumber()}
              </Typography>
            </Grid>
          </Grid>
        )}
      </TableCell>
      <TableCell>{event.from_account?.user?.username}</TableCell>
      <TableCell>
        {event.to_account?.user?.username
          ? event.to_account?.user?.username
          : deriveUserFromAddr(event.to_account?.address)}
      </TableCell>
      <TableCell>{moment(event.created_date).fromNow()}</TableCell>
    </TableRow>
  );
};
