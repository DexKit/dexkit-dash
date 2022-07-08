import {Box, makeStyles, useTheme, Grid, Typography} from '@material-ui/core';
import React, {useCallback} from 'react';
import {getNormalizedUrl} from 'utils/browser';
import {ChampionMetaItem} from 'modules/CoinLeague/utils/types';
import {getChampionsMultiplier} from 'modules/CoinLeague/utils/champions';
import {BigNumber} from 'ethers';
export interface Props {
  champion: ChampionMetaItem;
  onClick: (championId: ChampionMetaItem) => void;
  style: React.CSSProperties;
}

const useStyles = makeStyles((theme) => ({
  tokenContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(10),
    width: theme.spacing(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  token: {
    borderRadius: '50%',
    height: theme.spacing(12),
    width: theme.spacing(12),
  },
  item: {
    marginTop: theme.spacing(4),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
}));

export const SelectChampionListItem = (props: Props) => {
  const {champion, onClick, style} = props;
  const theme = useTheme();
  const classes = useStyles();
  const handleClick = useCallback(() => {
    onClick(champion);
  }, [champion, onClick]);

  return (
    <Box
      onClick={handleClick}
      style={{...style, padding: theme.spacing(2)}}
      className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={2}>
        <Grid item>
          <Box className={classes.tokenContainer}>
            <img
              alt={champion?.name}
              src={champion?.image ? getNormalizedUrl(champion?.image) : ''}
              className={classes.token}
            />
          </Box>
        </Grid>

        <Grid item xs>
          <Typography variant='body2' color='textSecondary'>
            {champion?.name}
          </Typography>
        </Grid>
        <Grid item>
          {champion?.rarity && (
            <Typography variant='body2' color='textSecondary'>
              {getChampionsMultiplier(BigNumber.from(champion?.rarity))}{' '}
              Multiplier
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(SelectChampionListItem);
