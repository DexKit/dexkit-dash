import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core';

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
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <IntlMessages id='app.coinLeagues.champion' /> #{champion?.id}
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChampionCard;
