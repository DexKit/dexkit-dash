import React, {useCallback} from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  makeStyles,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {getNormalizedUrl} from 'utils/browser';

const useStyles = makeStyles((theme) => ({
  image: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  paperButton: {
    borderRadius: theme.shape.borderRadius,
  },
  selected: {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Props {
  tokenId?: string;
  contractAddress?: string;
  name?: string;
  image?: string;
  selected?: boolean;
  onClick?: (params: {
    tokenId: string;
    contractAddress: string;
    image: string;
  }) => void;
}

export const ProfileImageCard: React.FC<Props> = ({
  image,
  name,
  contractAddress,
  tokenId,
  onClick,
  selected,
}) => {
  const classes = useStyles();

  const handleClick = useCallback(() => {
    if (onClick) {
      if (contractAddress && tokenId && image) {
        onClick({
          tokenId,
          contractAddress,
          image,
        });
      }
    }
  }, [onClick, tokenId, contractAddress]);

  return (
    <Card
      elevation={selected ? 12 : 0}
      variant={!selected ? 'outlined' : 'elevation'}
      className={selected ? classes.selected : undefined}>
      <CardActionArea disabled={!handleClick} onClick={handleClick}>
        {image ? (
          <CardMedia
            className={classes.image}
            image={getNormalizedUrl(image)}
          />
        ) : (
          <Skeleton variant='rect' className={classes.image} />
        )}
        <CardContent>
          <Typography noWrap variant='subtitle2'>
            {!name ? <Skeleton /> : name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProfileImageCard;
