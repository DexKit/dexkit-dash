import React from 'react';
import {Box, Typography} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
interface Props {
  message: string
};

const ErrorView: React.FC<Props> = ({ message }) => { 
  return (
    <Box pt={{xl: 4}} display={'flex'} justifyContent={'center'}>
       <WarningIcon color="secondary" fontSize="large" />
       <Typography component={'h3'}>Error: {message}</Typography>
    </Box>
  );
};

export default ErrorView;
