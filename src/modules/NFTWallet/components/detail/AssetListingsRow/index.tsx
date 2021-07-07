import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  Link,
  Button,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import moment from 'moment';
import {
  deriveUserFromAddr,
  getPriceFromOrder,
  getUSDPriceFromOrder,
  isAssetOwner,
  isSameAddress,
} from '../../../utils';

import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  listing: any;
  onCancel: (listing: any) => void;
  onBuy: (listing: any) => void;
}

export default (props: Props) => {
  const {listing, onCancel, onBuy} = props;
  const classes = useStyles();
  const userAccountAddress = useDefaultAccount();

  const handleBuy = useCallback(() => {
    onBuy(listing);
  }, [onBuy, listing]);

  const handleCancel = useCallback(() => {
    onCancel(listing);
  }, [onCancel, listing]);

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
        {isSameAddress(listing?.maker?.address, userAccountAddress || '') ? (
          <Button
            onClick={handleCancel}
            variant='outlined'
            size='small'
            color='primary'>
            <IntlMessages id='nfts.detail.listingCancel' />
          </Button>
        ) : (
          <Button
            onClick={handleBuy}
            variant='outlined'
            size='small'
            color='primary'>
            <IntlMessages id='nfts.detail.listingBuy' />
          </Button>
        )}
      </TableCell>
      <TableCell>
        {listing?.expiration_time > 0
          ? moment
              .unix(listing?.expiration_time)
              .add(moment.duration({minutes: moment().utcOffset()}))
              .fromNow()
          : 'never'}
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
