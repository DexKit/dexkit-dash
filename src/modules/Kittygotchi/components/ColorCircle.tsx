import React, {useState, useEffect, useCallback} from 'react';

import {makeStyles, ButtonBase} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  circle: {
    borderRadius: '50%',
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  button: {
    borderRadius: '50%',
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  selectedCircle: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.common.white,
  },
  selectedCircleInner: {
    borderRadius: '50%',
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

interface ColorCircleProps {
  color: string;
  selected?: boolean;
}

export const ColorCircle = (props: ColorCircleProps) => {
  const {color, selected} = props;
  const classes = useStyles();

  return (
    <ButtonBase className={classes.button}>
      {selected ? (
        <div className={classes.selectedCircle}>
          <div
            className={classes.selectedCircleInner}
            style={{backgroundColor: color}}
          />
        </div>
      ) : (
        <div className={classes.circle} style={{backgroundColor: color}} />
      )}
    </ButtonBase>
  );
};
