import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleWelcomeModal} from 'redux/_ui/actions';

export function useWelcomeModal() {
  const dispatch = useDispatch();
  const {showWelcome} = useSelector<AppState, AppState['ui']>(({ui}) => ui);

  const toggle = useCallback(() => {
    dispatch(toggleWelcomeModal());
  }, [dispatch]);

  return {toggle, show: showWelcome};
}
