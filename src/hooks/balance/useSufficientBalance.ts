import { GetMyBalance_ethereum_address_balances_currency } from "services/graphql/bitquery/balance/__generated__/GetMyBalance";
import { useBalance } from "./useBalance";

export interface SufficientBalanceHookData{
  amount: number;
  isSufficientAmount: boolean;
}

export const useSufficientBalance = (amountOrUsd: number, currency?: GetMyBalance_ethereum_address_balances_currency) => {
  const { loading, error, data: balance } = useBalance();
  const _amount = amountOrUsd != null && isFinite(amountOrUsd) && !isNaN(amountOrUsd) ?
    amountOrUsd : 0;
  if (currency != null) {
    const currencyBalance = balance?.filter(b => b?.currency?.symbol?.toUpperCase() === currency.symbol.toUpperCase()) ?? [];
    const currencyAmount = currencyBalance.reduce((amount, k) => {
      const value = Number(k.value);
      return isFinite(value) && !isNaN(value) ? amount + value : amount;
    }, 0);
    const data: SufficientBalanceHookData ={
      amount: currencyAmount,
      isSufficientAmount: currencyAmount >= _amount
    }
    return { loading, error, data}
  }
  const balanceUsd = balance.reduce((amount, k) => {
    const value = Number(k.valueInUsd);
    return isFinite(value) && !isNaN(value) ? amount + value : amount;
  }, 0);
  const data: SufficientBalanceHookData ={
    amount: balanceUsd,
    isSufficientAmount: balanceUsd >= _amount 
  }
  return { loading, error, data }
}