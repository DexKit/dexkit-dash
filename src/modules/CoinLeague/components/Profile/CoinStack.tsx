import React from 'react';

import {Box, Paper, Tooltip, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
  },
  coin: {
    borderRadius: '50%',
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  coinImage: {
    borderRadius: '50%',
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  item: {
    marginRight: -theme.spacing(4),
  },
}));

interface Props {
  coins: {image: string}[];
}

export const CoinStack: React.FC<Props> = ({coins}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {coins.map((coin: any, index: number) => (
        <div className={classes.item} key={index}>
          <Tooltip title='Title'>
            <Paper elevation={2} className={classes.coin}>
              <img className={classes.coinImage} src={coin.image} alt='' />
            </Paper>
          </Tooltip>
        </div>
      ))}
    </Box>
  );
};
