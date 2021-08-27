import {Box} from '@material-ui/core';
import React from 'react';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout = (props: Props) => {
  const {children} = props;

  return <Box py={{xs: 8}}>{children}</Box>;
};

export default MainLayout;
