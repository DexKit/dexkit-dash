import React, {useCallback} from 'react';

import {makeStyles, ButtonBase, Typography, Box} from '@material-ui/core';

import {KittygotchiTraitItem} from '../types/index';
import {KittygotchiTraitType} from '../constants/index';
import {LockIcon} from 'shared/components/Icons';
import {getImageFromTrait, getImageFromTraitIcon} from '../utils';

const useStyles = makeStyles((theme) => ({
  circle: {
    backgroundColor: theme.palette.grey[700],
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: theme.spacing(16),
    height: theme.spacing(16),
    '&:hover': {
      backgroundColor: theme.palette.grey[600],
    },
  },
  button: {
    borderRadius: '50%',
    width: theme.spacing(16),
    height: theme.spacing(16),
    '&:disabled': {
      backgrdound: theme.palette.grey[700],
    },
  },
  selectedCircle: {
    backgroundColor: theme.palette.grey[600],
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    },
  },
  selectedCircleInner: {
    borderRadius: '50%',
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  circleWrapper: {
    position: 'relative',
  },
  circleLock: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  circleLockIcon: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

interface TraitSelectorItemProps {
  traitType: KittygotchiTraitType;
  item: KittygotchiTraitItem;
  selected: boolean;
  locked?: boolean;
  onClick: (item: KittygotchiTraitItem) => void;
  disabled?: boolean;
}

export const TraitSelectorItem = (props: TraitSelectorItemProps) => {
  const {item, selected, locked, traitType, onClick, disabled} = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  return (
    <ButtonBase
      disabled={locked || disabled}
      className={classes.button}
      onClick={handleClick}>
      {selected ? (
        <div className={classes.selectedCircle}>
          <div className={classes.selectedCircleInner}>
            <img
              alt=''
              src={getImageFromTraitIcon(traitType, item.value)}
              className={classes.image}
            />
          </div>
        </div>
      ) : locked ? (
        <div className={classes.circleWrapper}>
          <div className={classes.circle}>
            <img
              alt=''
              src={getImageFromTraitIcon(traitType, item.value)}
              className={classes.image}
            />
          </div>
          <div className={classes.circleLock}>
            <Box>
              <Box className={classes.circleLockIcon}>
                <LockIcon />
              </Box>
              <Typography variant='caption'>{item.holding} KIT</Typography>
            </Box>
          </div>
        </div>
      ) : (
        <div className={classes.circleWrapper}>
          <div className={classes.circle}>
            <img
              alt=''
              src={getImageFromTraitIcon(traitType, item.value)}
              className={classes.image}
            />
          </div>
        </div>
      )}
    </ButtonBase>
  );
};

export default TraitSelectorItem;
