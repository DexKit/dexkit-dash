import {
  DialogTitle,
  Box,
  Typography,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
  },
}));

interface Props {
  title: React.ReactNode | React.ReactNode[] | string;
  icon?: React.ReactNode | React.ReactNode[];
  onClose?: (e: any) => void;
  chip?: React.ReactNode | React.ReactNode[];
}

export const CustomDialogTitle: React.FC<Props> = ({
  title,
  icon,
  onClose,
  chip,
}) => {
  const classes = useStyles();
  return (
    <DialogTitle>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center' alignContent='center'>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'
            className={classes.icon}
            mr={2}>
            {icon}
          </Box>
          <Typography variant='body1'>{title}</Typography>
        </Box>
        <Box alignContent='center' alignItems='center' display='flex'>
          {chip && (
            <Box
              mr={2}
              alignContent='center'
              alignItems='center'
              display='flex'>
              {chip}
            </Box>
          )}
          {onClose ? (
            <IconButton size='small' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Box>
      </Box>
    </DialogTitle>
  );
};

export default CustomDialogTitle;
