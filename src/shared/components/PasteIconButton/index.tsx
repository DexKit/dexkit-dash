import React, {useCallback} from 'react';
import {IconButton} from '@material-ui/core';
import CallReceivedIcon from '@material-ui/icons/CallReceived';

interface Props {
  onPaste: (data: string) => void;
}

export default (props: Props) => {
  const {onPaste} = props;

  const handlePaste = useCallback(() => {
    navigator.clipboard
      .readText()
      .then((text) => {
        onPaste(text);
      })
      .catch((err) => {
        onPaste('');
      });
  }, []);

  return (
    <IconButton size='small' onClick={handlePaste}>
      <CallReceivedIcon />
    </IconButton>
  );
};
