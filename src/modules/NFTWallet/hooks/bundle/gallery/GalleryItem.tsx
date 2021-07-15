import React, {useCallback} from 'react';
import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    cursor: 'pointer',
  },

  galleryImage: {
    height: '100%',
    width: '100%',
    minWidth: '100%',
    minHeight: '100%',
    padding: theme.spacing(2),
  },
}));

interface Props {
  asset: any;
  index: number;
  onClick: (index: number) => void;
}

export default (props: Props) => {
  const {index, asset, onClick} = props;
  const classes = useStyles();

  const handleClick = useCallback(
    (e) => {
      onClick(index);
    },
    [index],
  );

  return (
    <Box onClick={handleClick} className={classes.root}>
      <img src={asset?.image_url} className={classes.galleryImage} />
    </Box>
  );
};
