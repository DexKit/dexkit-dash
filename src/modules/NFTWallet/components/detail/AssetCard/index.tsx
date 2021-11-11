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
  Box,
  Tooltip,
} from '@material-ui/core';
import {toTokenUnitAmount} from '@0x/utils';
import {truncateText} from 'utils';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';

interface Props {
  asset: any;
  selected?: boolean;
  forSelect?: boolean;
  onClick: (asset: any) => void;
}

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
  },
  selected: {
    borderWidth: 1,
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
  },
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    height: theme.spacing(30),
  },
  checkIcon: {
    position: 'absolute',
    height: theme.spacing(9),
    width: theme.spacing(9),
    zIndex: 30,
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    borderRadius: '50%',
  },
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default (props: Props) => {
  const {asset, forSelect: elevate, selected, onClick} = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(asset);
  }, [asset, onClick]);

  return (
    <Card
      elevation={selected ? 24 : 1}
      variant={elevate && !selected ? 'outlined' : 'elevation'}
      className={clsx(classes.card, selected ? classes.selected : '')}>
      {selected ? (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          alignContent='center'
          boxShadow={1}
          className={classes.checkIcon}>
          <CheckCircleIcon color='primary' fontSize='large' />
        </Box>
      ) : null}
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
