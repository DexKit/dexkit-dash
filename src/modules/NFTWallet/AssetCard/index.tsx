import React, {useCallback} from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {OpenSeaAsset} from 'opensea-js/lib/types';

interface Props {
  asset: OpenSeaAsset;
  onClick: (asset: OpenSeaAsset) => void;
}

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

export default (props: Props) => {
  const {asset, onClick} = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(asset);
  }, [asset, onClick]);

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          className={classes.cardMedia}
          image={asset.imagePreviewUrl}
        />
        <CardContent>
          <Typography variant='caption' color='textSecondary'>
            {asset.collection.name}
          </Typography>
          <Typography>{asset.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
