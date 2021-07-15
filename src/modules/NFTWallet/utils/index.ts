import moment from 'moment';
import {toTokenUnitAmount} from '@0x/utils';
import {OrderSide} from 'opensea-js/lib/types';

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
  return (
    getPriceFromOrder(order) *
    parseFloat(order.payment_token_contract?.usd_price)
  );
}

export function deriveUserFromAddr(address?: string) {
  return address?.slice(2, 8).toUpperCase();
}

export function isSameAddress(address: string, other: string) {
  return address.toLowerCase() == other.toLowerCase();
}

export function isAssetOwner(asset: any, address: string) {
  if (asset) {
    for (let el of asset.top_ownerships) {
      if (isSameAddress(el.owner.address, address)) {
        return true;
      }
    }
  }

  return false;
}

export function isAssetSingleOwner(asset: any) {
  return asset.top_ownerships.length == 1;
}

export function getAssetOwnerAddress(asset: any) {
  if (!isAssetSingleOwner(asset)) {
    return '';
  }

  return asset.top_ownerships[0].owner.address;
}

export function getAssetOwnerName(asset: any) {
  if (!isAssetSingleOwner(asset)) {
    return '';
  }

  if (asset.top_ownerships[0].owner?.user?.username) {
    return asset.top_ownerships[0].owner?.user?.username;
  }

  return getAssetOwnerAddress(asset).substring(2, 8).toUpperCase();
}

export function getUnixDays(days: number): number {
  return Math.round(Date.now() / 1000 + 60 * 60 * 24 * days);
}

export const getFirstOrder = (asset: any) => {
  return asset?.orders.filter((o: any) => o.side == OrderSide.Sell)[0];
};

export const getFirstOrderTokenImage = (asset: any) => {
  return getFirstOrder(asset).payment_token_contract?.image_url;
};

export const getFirstOrderPrice = (asset: any) => {
  const order = getFirstOrder(asset);

  return toTokenUnitAmount(
    order.current_price,
    order.payment_token_contract?.decimals,
  ).toNumber();
};
