import { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/store";
import { toggleBalancesIsVisible } from "redux/_ui/actions";





export const useIsBalanceVisible = () => {
    const dispatch = useDispatch();
    const isBalanceVisible = useSelector<AppState, AppState['ui']['balancesVisible']>(
        (state) => state.ui.balancesVisible,
      );

    const setBalanceIsVisible = useCallback(()=> {
        dispatch(toggleBalancesIsVisible());
    }, [])

    return {isBalanceVisible, setBalanceIsVisible}
}