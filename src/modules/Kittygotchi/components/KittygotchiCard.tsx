import React, {useState, useCallback, useEffect} from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  CardContent,
  Card,
  CardMedia,
  CardActionArea,
  useTheme,
} from '@material-ui/core';

import {FlashOutlinedIcon, ShieldOutlinedIcon} from 'shared/components/Icons';
import {Kittygotchi} from 'types/kittygotchi';
import {Skeleton} from '@material-ui/lab';
import {leftPad} from 'utils';

const useStyles = makeStyles((theme) => ({
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[700],
  },
  media: {
    height: theme.spacing(40),
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

interface KittygotchiCardProps {
  kittygotchi?: Kittygotchi;
  onClick?: (kittygotchi: Kittygotchi) => void;
  loading?: boolean;
}

export const KittygotchiCard = (props: KittygotchiCardProps) => {
  const {kittygotchi, onClick, loading} = props;
  const classes = useStyles();

  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (kittygotchi && onClick) {
      onClick(kittygotchi);
    }
  }, [kittygotchi, onClick]);

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        {loading ? (
          <Skeleton variant='rect' className={classes.media} />
        ) : kittygotchi?.image ? (
          <CardMedia image={kittygotchi?.image} className={classes.media} />
        ) : (
          <Skeleton variant='rect' className={classes.media} />
        )}
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h6'>
                <strong>
                  {loading ? <Skeleton /> : <>Kittygotchi #{kittygotchi?.id}</>}
                </strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default KittygotchiCard;
