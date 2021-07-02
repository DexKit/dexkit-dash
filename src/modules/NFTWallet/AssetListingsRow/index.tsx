import {toTokenUnitAmount} from '@0x/utils';
import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  Link,
} from '@material-ui/core';
import React from 'react';
import moment from 'moment';
import {
  deriveUserFromAddr,
  getPriceFromOrder,
  getUSDPriceFromOrder,
} from '../utils';

import {Link as RouterLink} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  listing: any;
}

export default (props: Props) => {
  const {listing} = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>
        <Grid alignItems='center' alignContent='center' container spacing={2}>
          <Grid item>
            <Tooltip
              title={listing?.payment_token_contract.symbol}
              aria-label='add'>
              <Avatar
                className={classes.tokenImageSmall}
                src={listing?.payment_token_contract.image_url as string}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography>{getPriceFromOrder(listing).toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>${getUSDPriceFromOrder(listing).toFixed(2)}</TableCell>
      <TableCell>
        {/* <Button variant='outlined' size='small' color='primary'>
          <IntlMessages id='nfts.detail.listingBuy' />
        </Button> */}
      </TableCell>
      <TableCell>
        {moment
          .unix(listing?.expiration_time)
          .add(moment.duration({minutes: moment().utcOffset()}))
          .fromNow()}
      </TableCell>
      <TableCell>
        <Link
          component={RouterLink}
          to={`/nfts/wallet/${listing?.maker?.address}`}>
          {listing.maker?.user?.username
            ? listing.maker?.user?.username
            : deriveUserFromAddr(listing?.maker?.address)}
        </Link>
      </TableCell>
    </TableRow>
  );
};
