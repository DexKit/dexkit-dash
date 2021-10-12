import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import {red, green} from '@material-ui/core/colors';

export enum SubmitState {
  None,
  WaitingWallet,
  Submitted,
  Error,
  Confirmed,
}

type Props = {
  state: SubmitState;
  defaultMsg: string;
  confirmedMsg: string;
};

export const ButtonState = (props: Props) => {
  const {state, defaultMsg, confirmedMsg} = props;

  switch (state) {
    case SubmitState.WaitingWallet:
      return (
        <>
          <CircularProgress color={'secondary'} />
          Waiting Wallet
        </>
      );
    case SubmitState.Error:
      return (
        <>
          <Icon style={{color: red[500]}}>error</Icon>
          Error
        </>
      );
    case SubmitState.Submitted:
      return (
        <>
          <CircularProgress color={'secondary'} />
          Waiting for Network Confirmation
        </>
      );
    case SubmitState.Confirmed:
      return (
        <>
          <Icon style={{color: green[500]}}>success</Icon>
          {confirmedMsg}
        </>
      );

    default:
      return <>{defaultMsg}</>;
  }
};
