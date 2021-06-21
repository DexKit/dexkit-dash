import moment from 'moment';
import {toTokenUnitAmount} from '@0x/utils';

export function sortEventArray(arr: any[]): any[] {
  return arr
    .sort((a, b) => {
      let dateA = moment(a.created_date);
      let dateB = moment(b.created_date);

      if (dateA.isBefore(dateB)) {
        return -1;
      } else if (dateA.isAfter(dateB)) {
        return 1;
      }

      return 0;
    })
    .reverse();
}

export function getPriceFromOrder(order: any) {
  return toTokenUnitAmount(
    order.base_price,
    order.payment_token_contract.decimals,
  ).toNumber();
}

export function getUSDPriceFromOrder(order: any) {
  return getPriceFromOrder(order) * order.payment_token_contract?.usd_price;
}

export function deriveUserFromAddr(address?: string) {
  return address?.slice(2, 8).toUpperCase();
}
