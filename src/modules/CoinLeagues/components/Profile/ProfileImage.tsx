import React from 'react';

import {makeStyles, ButtonBase} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(26),
    height: theme.spacing(26),
    borderRadius: '50%',
    background: theme.palette.background.paper,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  button: {
    width: theme.spacing(26),
    height: theme.spacing(26),
    borderRadius: '50%',
  },
}));

interface Props {
  image?: string;
  onClick?: () => void;
}

export const ProfileImage: React.FC<Props> = ({image, onClick}) => {
  const classes = useStyles();
  console.log('image', image);
  return (
    <ButtonBase className={classes.button} onClick={onClick}>
      <img alt='' className={classes.root} src={image} />
    </ButtonBase>
  );
};
