import {Dialog, DialogContent, DialogProps} from '@material-ui/core';
import React from 'react';

interface Props extends DialogProps {}

export const SwapHistoricTable = (props: Props) => {
  return (
    <Dialog {...props}>
      <DialogContent></DialogContent>
    </Dialog>
  );
};
