import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {setShowAccounts} from 'redux/_ui/actions';

export function useAccountsModal() {
  const dispatch = useDispatch();
  const {showAccounts} = useSelector<AppState, AppState['ui']>(({ui}) => ui);

  const setShow = useCallback(
    (value: boolean) => {
      dispatch(setShowAccounts(value));
    },
    [dispatch],
  );

  return {setShow, showAccounts};
}
