import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';

interface Props {
}

const LoadingStep: React.FC<Props> = (props) => {
  return (
    <>
      <DialogContent>
        Loading...
      </DialogContent>
    </>
  );
}

export default LoadingStep