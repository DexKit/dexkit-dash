import {Box, Paper} from '@material-ui/core';
import React from 'react';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default (props: Props) => {
  const {children} = props;

  return (
    <Box
      boxShadow={1}
      zIndex={999999}
      position='sticky'
      right={0}
      bottom={0}
      left={0}>
      <Paper>
        <Box p={4}>{children}</Box>
      </Paper>
    </Box>
  );
};
