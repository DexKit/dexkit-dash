import Paper from '@material-ui/core/Paper';
import React, {useCallback} from 'react';
import {ReactComponent as CloseCircle} from 'assets/images/icons/close-circle.svg';
import {Box, makeStyles, Grid, Typography, IconButton} from '@material-ui/core';
import { getNormalizedUrl } from 'utils/browser';
import { ChampionMetaItem } from 'modules/CoinLeagues/utils/types';
import { getChampionsMultiplier } from 'modules/CoinLeagues/utils/champions';
import { BigNumber } from 'ethers';

type Props = {
  handleDelete: () => void;
  champion: ChampionMetaItem;
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
  const {handleDelete, champion} = props;
  const classes = useStyles();

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
            <img src={champion?.image ? getNormalizedUrl(champion?.image) : ''} className={classes.coin} alt={'Champion'} />
          </Box>
        </Grid>

        <Grid item xs>
          <Typography variant='body2' color='textSecondary'>
            {champion?.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='body2' color='textSecondary'>
            {getChampionsMultiplier(BigNumber.from(champion?.rarity || '7'))} Multiplier
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
