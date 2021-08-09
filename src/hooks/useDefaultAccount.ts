import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';

export const useDefaultAccount = () => {
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(
    (state) => state.ui.accounts,
  );
  if (accounts.length) {
    return accounts[0].address;
  }
};
