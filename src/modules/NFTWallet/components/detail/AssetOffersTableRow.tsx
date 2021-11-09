import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  Button,
  Link,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {Link as RouterLink} from 'react-router-dom';

import {
  deriveUserFromAddr,
  getPriceFromOrder,
  getUSDPriceFromOrder,
  isAssetOwner,
  isSameAddress,
} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  offer: any;
  asset?: any;
  onCancel: (offer: any) => void;
  onAccept: (offer: any) => void;
}

export default (props: Props) => {
  const {offer, asset, onCancel, onAccept} = props;
  const classes = useStyles();
  const userAccountAddress = useDefaultAccount();

  const handleAccept = useCallback(() => {
    onAccept(offer);
  }, [offer, onAccept]);

  const handleCancel = useCallback(() => {
    onCancel(offer);
  }, [offer, onCancel]);

  return (
    <TableRow>
      <TableCell>
        <Grid alignItems='center' alignContent='center' container spacing={2}>
          <Grid item>
            <Tooltip
              title={offer.payment_token_contract.symbol}
              aria-label='add'>
              <Avatar
                className={classes.tokenImageSmall}
                src={offer.payment_token_contract.image_url as string}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography>{getPriceFromOrder(offer).toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>${getUSDPriceFromOrder(offer).toFixed(2)}</TableCell>
      <TableCell>
        {!isAssetOwner(asset, userAccountAddress || '') &&
        isSameAddress(offer?.maker?.address, userAccountAddress || '') ? (
          <Button
            onClick={handleCancel}
            size='small'
            color='primary'
            variant='outlined'>
            <IntlMessages id='nfts.detail.offersCancel' />
          </Button>
        ) : null}
        {isAssetOwner(asset, userAccountAddress || '') &&
        !isSameAddress(offer?.maker?.address, userAccountAddress || '') ? (
          <Button
            onClick={handleAccept}
            size='small'
            color='primary'
            variant='outlined'>
            <IntlMessages id='nfts.detail.offersAccept' />
          </Button>
        ) : null}
      </TableCell>
      <TableCell>
        {offer.expiration_time
          ? moment
              .unix(offer.expiration_time)
              .add(moment.duration({minutes: moment().utcOffset()}))
              .fromNow()
          : null}
      </TableCell>
      {isSameAddress(offer.maker?.address, userAccountAddress || '') ? (
        <TableCell>
          <Link
            component={RouterLink}
            to={`/nfts/wallet/${offer?.maker?.address}`}>
            you
          </Link>
        </TableCell>
      ) : (
        <TableCell>
          <Link
            component={RouterLink}
            to={`/nfts/wallet/${offer?.maker?.address}`}>
            {offer.maker?.user?.username
              ? offer.maker?.user?.username
              : deriveUserFromAddr(offer.maker?.address)}
          </Link>
        </TableCell>
      )}
    </TableRow>
  );
};
