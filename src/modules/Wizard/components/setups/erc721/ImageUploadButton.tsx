import {
  Button,
  withStyles,
  makeStyles,
  ButtonBase,
  Theme,
} from '@material-ui/core';
import React, {useRef, useEffect, useState, useCallback} from 'react';

import ImageIcon from '@material-ui/icons/Image';

const CustomButton = withStyles((theme: Theme) => ({
  root: {
    height: theme.spacing(30),
    width: theme.spacing(30),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignCOntent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.20)',
    },
    '&:hover .btn': {},
  },
}))(ButtonBase);

const useStyle = makeStyles((theme) => ({
  img: {
    height: theme.spacing(30),
    width: theme.spacing(30),
    borderRadius: '50%',
  },
  error: {
    borderColor: theme.palette.error.main,
    borderWidth: 1,
    borderStyle: 'solid',
  },
}));

export interface ImageUploadButtonProps {
  onChange: (file: File | null) => void;
  file: File | null;
  error?: boolean;
}

export function ImageUploadButton(props: ImageUploadButtonProps) {
  const {onChange, file, error} = props;

  const classes = useStyle();

  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {}, []);

  const handleClick = useCallback(() => {
    if (file) {
      onChange(null);

      return;
    }
    inputRef.current?.click();
  }, [onChange, file, inputRef]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files !== null && e.target.files.length > 0) {
        let file = e.target.files[0];

        onChange(file);
      }
    },
    [onChange],
  );

  useEffect(() => {
    if (file) {
      if (imgRef.current) {
        imgRef.current.src = URL.createObjectURL(file);
      }
    }
  }, [file]);

  return (
    <>
      <input
        onChange={handleChange}
        type='file'
        ref={inputRef}
        style={{display: 'none'}}
        accept='image/png, image/gif, image/jpeg, image/svg'
      />
      <CustomButton
        className={error ? classes.error : undefined}
        onClick={handleClick}>
        {file ? <img className={classes.img} ref={imgRef} /> : <ImageIcon />}
      </CustomButton>
    </>
  );
}

export default ImageUploadButton;
