import {DialogTitle, Box, Typography, IconButton} from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
interface Props {
  title: string;
  icon?: React.ReactNode | React.ReactNode[];
  onClose?: (e: any) => void;
}

export const CustomDialogTitle: React.FC<Props> = ({title, icon, onClose}) => {
  return (
    <DialogTitle>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center' alignContent='center'>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'
            mr={2}>
                {icon}
          </Box>
          <Typography variant='body1'>{title}</Typography>
        </Box>
        <Box>
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