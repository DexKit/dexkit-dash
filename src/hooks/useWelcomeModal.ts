import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {AppState} from 'redux/store';
import {toggleWelcomeModal, setLoginBackRoute} from 'redux/_ui/actions';

export function useWelcomeModal() {
  const dispatch = useDispatch();
  const location = useLocation();
  const {showWelcome} = useSelector<AppState, AppState['ui']>(({ui}) => ui);
  const {loginBackRoute} = useSelector<AppState, AppState['ui']>(({ui}) => ui);

  const toggle = useCallback(() => {
    dispatch(setLoginBackRoute(location.pathname));
    dispatch(toggleWelcomeModal());
  }, [dispatch, location.pathname]);

  const onSetLoginBackRoute = useCallback(
    (route?: string) => {
      dispatch(setLoginBackRoute(route));
    },
    [dispatch],
  );

  return {toggle, show: showWelcome, loginBackRoute, onSetLoginBackRoute};
}
