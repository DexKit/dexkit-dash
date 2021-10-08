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
} from '@material-ui/core';

import {FlashOutlinedIcon, ShieldOutlinedIcon} from 'shared/components/Icons';
import {Kittygotchi} from 'types/kittygotchi';

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
  kittygotchi: Kittygotchi;
  onClick: (kittygotchi: Kittygotchi) => void;
}

export const KittygotchiCard = (props: KittygotchiCardProps) => {
  const {kittygotchi, onClick} = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(kittygotchi);
  }, [kittygotchi, onClick]);

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia image={kittygotchi.image} className={classes.media} />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h6'>Kittygotchi #1</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Box display='flex' alignItems='center' alignContent='center'>
                    <Box className={classes.iconWrapper} mr={2}>
                      <FlashOutlinedIcon className={classes.icon} />
                    </Box>
                    <Typography variant='body1'>
                      {kittygotchi.attack}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display='flex' alignItems='center' alignContent='center'>
                    <Box className={classes.iconWrapper} mr={2}>
                      <ShieldOutlinedIcon className={classes.icon} />
                    </Box>
                    <Typography variant='body1'>
                      {kittygotchi.defense}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box display='flex' alignItems='center' alignContent='center'>
                    <Box className={classes.iconWrapper} mr={2}>
                      <FlashOutlinedIcon className={classes.icon} />
                    </Box>
                    <Typography variant='body1'>{kittygotchi.run}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default KittygotchiCard;
