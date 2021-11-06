import React from 'react';

import {useIntl} from 'react-intl';

import Button from '@material-ui/core/Button';
import {Steps} from 'types/app';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

interface Props {
  step: Steps;
  onClose: () => void;
}

const DoneStep: React.FC<Props> = (props) => {
  const {step, onClose} = props;
  const {messages} = useIntl();

  return (
    <Button
      style={{margin: 0}}
      fullWidth
      variant='outlined'
      color='primary'
      size='large'
      onClick={onClose}>
      <IntlMessages id='app.dashboard.done' />
    </Button>
  );
};

export default DoneStep;
