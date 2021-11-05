import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles,
  CardActionArea,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  media: {
    minHeight: theme.spacing(40),
    maxHeight: theme.spacing(40),
  },
}));

interface Props {}

export const CollectionItemsSkeleton = (props: Props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardActionArea>
            <Skeleton className={classes.media} />
            <CardContent>
              <Typography variant='body1'>
                <Skeleton width='60%' />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CollectionItemsSkeleton;
