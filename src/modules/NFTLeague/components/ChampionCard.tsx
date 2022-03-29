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
  rarity?: number;
  selected?: boolean;
  onClick?: (params: {
    tokenId: string;
    contractAddress: string;
    image: string;
    rarity?: number;
  }) => void;
}

export const ChampionCard: React.FC<Props> = ({
  image,
  name,
  rarity,
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
          rarity,
        });
      }
    }
  }, [onClick, tokenId, contractAddress, image, rarity]);

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

export default ChampionCard;
