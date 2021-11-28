import Paper from '@material-ui/core/Paper';
import React, {useCallback} from 'react';
import {ReactComponent as CloseCircle} from 'assets/images/icons/close-circle.svg';
import {Box, makeStyles, Grid, Typography, IconButton} from '@material-ui/core';
import { useChampionMetadata } from 'modules/CoinLeagues/hooks/champions';

type Props = {
  handleDelete: () => void;
  championId: string;
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

export const ChampionItem = (props: Props) => {
  const {handleDelete, championId} = props;
  const classes = useStyles();

  const championQuery = useChampionMetadata(championId);
  const championMetadata = championQuery.data;

  const onClickDelete = useCallback(
    (ev: any) => {
      handleDelete();
    },
    [handleDelete],
  );

  return (
    <Paper className={classes.item}>
      <Grid container alignItems='center' spacing={4}>
        <Grid item>
          <Box className={classes.coinContainer}>
            <img src={championMetadata?.image} className={classes.coin} alt={'Champion'} />
          </Box>
        </Grid>

        <Grid item xs>
          <Typography variant='body2' color='textSecondary'>
            {championMetadata?.name}
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
