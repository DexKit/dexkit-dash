import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {Box} from '@material-ui/core';

interface Props {}

const LoadingView: React.FC<Props> = (props) => {
  return (
    <Box pt={{xl: 4}}>
      <IntlMessages id='app.common.loading' />
    </Box>
  );
};

export default LoadingView;
