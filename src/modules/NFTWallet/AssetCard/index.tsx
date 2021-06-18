import React, {useCallback} from 'react';
import {
  Avatar,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {truncateText} from 'utils';

interface Props {
  asset: any;
  onClick: (asset: any) => void;
}

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    height: theme.spacing(30),
  },
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default (props: Props) => {
  const {asset, onClick} = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(asset);
  }, [asset, onClick]);

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          className={classes.cardMedia}
          image={asset.image_preview_url}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant='caption' color='textSecondary'>
            {truncateText(asset.collection.name, 30)}
          </Typography>
          <Typography variant='body2'>
            {truncateText(asset.name, 25)}
          </Typography>
          {asset.sell_orders ? (
            <>
              <Typography variant='caption' color='textSecondary'>
                Price
              </Typography>
              <Grid
                alignItems='center'
                alignContent='center'
                container
                spacing={2}>
                <Grid item>
                  <Tooltip
                    title={asset.sell_orders[0].payment_token_contract.symbol}
                    aria-label='add'>
                    <Avatar
                      className={classes.tokenImageSmall}
                      src={
                        asset.sell_orders[0].payment_token_contract
                          .image_url as string
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Typography>
                    {toTokenUnitAmount(
                      asset.sell_orders[0].current_price,
                      asset.sell_orders[0].payment_token_contract.decimals,
                    ).toNumber()}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
