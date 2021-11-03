import React, {useEffect, useState} from 'react';
import mergeImages from 'merge-images';

interface Props {
  images: string[];
}

export const KittygotchiImage = (props: Props) => {
  const {images} = props;
  const [imgB64, setImgB64] = useState<string>();

  useEffect(() => {
    mergeImages(images).then((b64: string) => {
      setImgB64(b64);
    });
  }, [images]);

  return <img src={imgB64} width={500} height={500} />;
};

export default KittygotchiImage;
