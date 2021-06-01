import React from 'react';
import {Box} from '@material-ui/core';

interface Props {}

const LoadingView: React.FC<Props> = (props) => {
  return <Box pt={{xl: 4}}>Loading...</Box>;
};

export default LoadingView;
