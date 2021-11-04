import React from 'react';
import {Button} from '@material-ui/core';
import {Steps} from 'types/app';

interface Props {
  step: Steps;
  onClose: () => void;
}

const DoneStep: React.FC<Props> = (props) => {
  const {onClose} = props;

  return (
    <>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='outlined'
        color='primary'
        size='large'
        onClick={onClose}>
        Done
      </Button>
    </>
  );
};

export default DoneStep;
