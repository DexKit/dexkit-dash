import React from 'react';

import {useIntl} from 'react-intl';

import {Box} from '@material-ui/core';

interface Props {}

const LoadingView: React.FC<Props> = (props) => {
  const {messages} = useIntl();

  return <Box pt={{xl: 4}}>{messages['app.loading']}...</Box>;
};

export default LoadingView;
