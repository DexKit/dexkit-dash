import React from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  media: {
    height: theme.spacing(32),
  },
}));

interface ChampionCardProps {
  champion?: any;
  loading?: boolean;
}

export const ChampionCard = (props: ChampionCardProps) => {
  const {loading, champion} = props;

  const classes = useStyles();

  return (
    <Card>
      {loading ? (
        <Skeleton variant='rect' className={classes.media} />
      ) : (
        <CardMedia className={classes.media} />
      )}
      <CardContent>
        <Typography variant='body1'>
          {loading ? <Skeleton /> : <>Champion #{champion?.id}</>}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChampionCard;
