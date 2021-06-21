import {Numberish, toTokenUnitAmount} from '@0x/utils';
import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import moment from 'moment';
import {deriveUserFromAddr} from '../utils';
import IntlMessages from '@crema/utility/IntlMessages';

import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PanToolIcon from '@material-ui/icons/PanTool';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

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
const EVENT_TRANSFER = 'transfer';
const EVENT_SALE = 'sale';

function getEventType(event: any) {
  let is_transfer_event = event.event_type == 'transfer';
  let is_created_event = event.event_type == 'created';
  let is_offer_event = event.event_type == 'offer_entered';
  let is_sale_event = event.event_type == 'successful';

  let is_from_null_address = event.from_account?.address == NULL_ADDRESS;

  let is_to_owner = event.to_account?.address == event.asset.owner.address;
  let has_starting_price = event.starting_price != null;

  if (is_from_null_address && is_transfer_event) {
    return EVENT_CREATED;
  }

  if (is_created_event && has_starting_price) {
    return EVENT_LISTING;
  }

  if (is_transfer_event) {
    return EVENT_TRANSFER;
  }

  if (is_offer_event) {
    return EVENT_OFFER;
  }

  if (is_sale_event) {
    return EVENT_SALE;
  }

  return '';
}

const getEventIntlID = (event: any) => {
  switch (getEventType(event)) {
    case EVENT_SALE:
      return 'nfts.detail.listingEventSale';
    case EVENT_TRANSFER:
      return 'nfts.detail.listingEventTransfer';
    case EVENT_LISTING:
      return 'nfts.detail.listingEventListing';
    case EVENT_OFFER:
      return 'nfts.detail.listingEventOffer';
    case EVENT_CREATED:
      return 'nfts.detail.listingEventCreated';
    default:
      return '';
  }
};

const getEventIcon = (event: any) => {
  switch (getEventType(event)) {
    case EVENT_SALE:
      return <ShoppingCartIcon />;
    case EVENT_TRANSFER:
      return <SyncAltIcon />;
    case EVENT_LISTING:
      return <LocalOfferIcon />;
    case EVENT_OFFER:
      return <PanToolIcon />;
    case EVENT_CREATED:
      return <ChildFriendlyIcon />;
    default:
      return '';
  }
};

function AssetEventPrice(props: any) {
  const {event} = props;
  const classes = useStyles();

  const getPriceFromEvent = useCallback((event: any) => {
    let tokenAmount: Numberish = '0';

    if (getEventType(event) == EVENT_OFFER) {
      tokenAmount = event.bid_amount;
    } else if (getEventType(event) == EVENT_SALE) {
      tokenAmount = event.total_price;
    } else {
      tokenAmount = event.starting_price;
    }

    return toTokenUnitAmount(tokenAmount, event.payment_token?.decimals)
      .toNumber()
      .toFixed(2);
  }, []);

  return (
    <>
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
            <Typography>{getPriceFromEvent(event)}</Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}

function AssetEventFrom(props: any) {
  const {event} = props;

  if (getEventType(event) == EVENT_SALE) {
    return (
      <>
        {event.seller?.user
          ? event.seller?.user?.username
          : deriveUserFromAddr(event.seller?.user?.address)}
      </>
    );
  }

  return (
    <>
      {event.from_account?.user
        ? event.from_account?.user?.username
        : deriveUserFromAddr(event.from_account?.address)}
    </>
  );
}

function AssetEventTo(props: any) {
  const {event} = props;

  if (getEventType(event) == EVENT_SALE) {
    return (
      <>
        {event.winner_account?.user
          ? event.winner_account?.user?.username
          : deriveUserFromAddr(event.winner_account?.user?.address)}
      </>
    );
  }

  return (
    <>
      {event.to_account?.user?.username
        ? event.to_account?.user?.username
        : deriveUserFromAddr(event.to_account?.address)}
    </>
  );
}

export default (props: Props) => {
  const {event} = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>
        <Grid alignItems='center' alignContent='center' container spacing={2}>
          <Grid item>{getEventIcon(event)}</Grid>
          <Grid item>
            <Typography>
              <IntlMessages id={getEventIntlID(event)} />
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        {getEventType(event) != EVENT_TRANSFER ? (
          <AssetEventPrice event={event} />
        ) : null}
      </TableCell>
      <TableCell>
        <AssetEventFrom event={event} />
      </TableCell>
      <TableCell>
        <AssetEventTo event={event} />
      </TableCell>
      <TableCell>{moment(event.created_date).fromNow()}</TableCell>
    </TableRow>
  );
};
