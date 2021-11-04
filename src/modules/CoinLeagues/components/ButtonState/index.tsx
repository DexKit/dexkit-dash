import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import {green, red} from '@material-ui/core/colors';

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
          <IntlMessages key='app.coinLeagues.waitingWallet' />
        </>
      );
    case SubmitState.Error:
      return (
        <>
          <Icon style={{color: red[500]}}>error</Icon>
          <IntlMessages key='app.coinLeagues.error' />
        </>
      );
    case SubmitState.Submitted:
      return (
        <>
          <CircularProgress color={'secondary'} />
          <IntlMessages key='app.coinLeagues.waitingNetworkConfirmation' />
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
