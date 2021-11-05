import Paper from '@material-ui/core/Paper';
import React, {useCallback} from 'react';
import {ReactComponent as CloseCircle} from 'assets/images/icons/close-circle.svg';
import {Box, makeStyles, Grid, Typography, IconButton} from '@material-ui/core';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
type Props = {
  handleDelete: (index: number) => void;
  coin: CoinFeed;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  coinContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  coin: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
}));

export const CoinItem = (props: Props) => {
  const {handleDelete, coin, index} = props;
  const classes = useStyles();

  const onClickDelete = useCallback(
    (ev: any) => {
      handleDelete(index);
    },
    [handleDelete, index],
  );

  return (
    <Paper className={classes.item}>
      <Grid container alignItems='center' spacing={4}>
        <Grid item>
          <Box className={classes.coinContainer}>
            <img src={coin?.logo} className={classes.coin} />
          </Box>
        </Grid>

        <Grid item xs>
          <Typography variant='body1'>{`${coin.base.toUpperCase()} / ${coin.quote.toUpperCase()}`}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {coin.baseName}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={onClickDelete} size='small'>
            <CloseCircle />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
