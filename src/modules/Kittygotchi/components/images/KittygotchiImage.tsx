import React, {useEffect, useState} from 'react';
import mergeImages from 'merge-images';

import {makeStyles, Box} from '@material-ui/core';

interface Props {
  images: string[];
}

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: 'auto',
  },
}));

export const KittygotchiImage = (props: Props) => {
  const {images} = props;
  const [imgB64, setImgB64] = useState<string>();

  const classes = useStyles();

  useEffect(() => {
    mergeImages(images.map((i) => ({src: i})))
      .then((b64: string) => {
        setImgB64(b64);
      })
      .catch((err: any) => {
        console.log('ERROR bs65', err);
      });
      /* eslint-disable */
  }, [JSON.stringify(images)]);

  if (imgB64 !== undefined) {
    return (
      <img
        alt=''
        src={imgB64}
        className={classes.image}
        crossOrigin='anonymous'
      />
    );
  }

  return <Box></Box>;
};

export default KittygotchiImage;
