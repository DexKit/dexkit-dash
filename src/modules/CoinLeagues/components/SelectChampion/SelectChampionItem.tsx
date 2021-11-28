import {Box, makeStyles, useTheme, Grid, Typography} from '@material-ui/core';
import React, {useCallback} from 'react';
import { useChampionMetadataQuery } from 'modules/CoinLeagues/hooks/champions';

export interface Props {
  championId: string;
  onClick: (championId: string) => void;
  style: React.CSSProperties;
}

const useStyles = makeStyles((theme) => ({
  tokenContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  token: {
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

export const SelectChampionListItem = (props: Props) => {
  const {championId, onClick, style} = props;
  const theme = useTheme();
  const classes = useStyles();

  const championQuery =  useChampionMetadataQuery(championId);
  const championMetadata = championQuery.data;
  console.log(championMetadata);
  const handleClick = useCallback(() => {
    onClick(championId);
  }, [championId, onClick]);

  return (
    <Box
      onClick={handleClick}
      style={{...style, padding: theme.spacing(2)}}
      className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={2}>
        <Grid item>
          <Box className={classes.tokenContainer}>
          {/*  <img alt='' src={championMetadata?.image} className={classes.token} />*/}
          </Box>
        </Grid>

        <Grid item xs>
          <Typography variant='body2' color='textSecondary'>
            {championMetadata?.name}
          </Typography>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(SelectChampionListItem);
