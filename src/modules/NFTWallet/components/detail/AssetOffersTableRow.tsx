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
import {
  deriveUserFromAddr,
  getPriceFromOrder,
  getUSDPriceFromOrder,
} from 'modules/NFTWallet/utils';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  offer: any;
}

export default (props: Props) => {
  const {offer} = props;
  const classes = useStyles();

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
      <TableCell>{moment(offer.created_date).fromNow()}</TableCell>
      <TableCell>
        {offer.maker?.user?.username
          ? offer.maker?.user?.username
          : deriveUserFromAddr(offer.maker?.address)}
      </TableCell>
    </TableRow>
  );
};
