import React from 'react';
import {Box} from '@material-ui/core';

interface Props {
  message: string
};

const ErrorView: React.FC<Props> = ({ message }) => { 
  return (
    <Box pt={{xl: 4}}>
      Error {message}
    </Box>
  );
};

export default ErrorView;
