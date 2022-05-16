import {Box} from '@material-ui/core';
import React from 'react';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export const MainLayout = (props: Props) => {
  const {children} = props;

  return <Box>{children}</Box>;
};

export default MainLayout;
