import React from 'react';

import {useIntl} from 'react-intl';

import {Button, CircularProgress, Typography} from '@material-ui/core';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

// import {useStyles} from './index.style';

interface Props {
  currentStepIndex: number;
}

const LoadingStep: React.FC<Props> = (props) => {
  const {currentStepIndex} = props;
  const {messages} = useIntl();
  // const classes = useStyles();

  return (
    <>
      {currentStepIndex !== -1 && (
        <Typography align='center' style={{paddingBottom: 10}}>
          <IntlMessages id='app.dashboard.confirmWalletAndWait' />
        </Typography>
      )}
      <Button
        style={{margin: 0}}
        fullWidth
        color='primary'
        size='large'
        disabled>
        <CircularProgress style={{alignSelf: 'center'}} size='40px' />
      </Button>
    </>
  );
};

export default LoadingStep;
