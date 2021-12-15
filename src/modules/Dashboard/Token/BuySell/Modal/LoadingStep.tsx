import React from 'react';

import {Button, CircularProgress, Typography} from '@material-ui/core';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';



interface Props {
  currentStepIndex: number;
}

const LoadingStep: React.FC<Props> = (props) => {
  const {currentStepIndex} = props;


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
