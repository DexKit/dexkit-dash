import { useSelector } from "react-redux";
import { AppState } from "redux/store";



export const useDefaultLabelAccount = () => {
    const accounts = useSelector<AppState, AppState['ui']['accounts']>(state => state.ui.accounts);
    if(accounts.length){
        return accounts[0].label || accounts[0].address;
    }
}