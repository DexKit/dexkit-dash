import {ethers} from 'ethers';
import {
  EARLY_ACCESS_BITT_AMOUNT,
  EARLY_ACCESS_KIT_AMOUNT,
  EVENT_HOLDING_AMOUNT,
  SALE_EARLY_FIRST_ROUND_DATE,
  SALE_EARLY_SECOND_ROUND_DATE,
  SALE_EARLY_THIRD_ROUND_DATE,
  FIRST_ROUND_DATE,
  SECOND_ROUND_DATE,
  THIRD_ROUND_DATE,
} from '../constants';
import {ChampionsEventRound} from './types';
import {ChainId} from 'types/blockchain';

export function getEventCurrentRound(): ChampionsEventRound {
  return ChampionsEventRound.FIRST;
}

export function getEventAccessDate(
  round: ChampionsEventRound,
  offset = 0,
  chainId?: number,
): number {
  let currChain = chainId ? chainId : ChainId.Matic;

  if (chainId !== ChainId.Matic && chainId !== ChainId.Mumbai) {
    currChain = ChainId.Matic;
  }

  if (round === ChampionsEventRound.FIRST) {
    return FIRST_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.SECOND) {
    return SECOND_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.THIRD) {
    return THIRD_ROUND_DATE[currChain] - offset;
  }

  return 0;
}

export function getMaxSupplyForRound(round: ChampionsEventRound): number {
  if (round === ChampionsEventRound.FIRST) {
    return 3300 + 1000;
  } else if (round === ChampionsEventRound.SECOND) {
    return 3300;
  } else if (round === ChampionsEventRound.THIRD) {
    return 3400;
  }

  return 0;
}

export function getEventEarlyAccessDate(
  round: ChampionsEventRound,
  offset = 0,
  chainId?: number,
): number {
  let currChain = chainId ? chainId : ChainId.Matic;

  if (currChain !== ChainId.Matic && chainId !== ChainId.Mumbai) {
    currChain = ChainId.Matic;
  }

  if (round === ChampionsEventRound.FIRST) {
    return SALE_EARLY_FIRST_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.SECOND) {
    return SALE_EARLY_SECOND_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.THIRD) {
    return SALE_EARLY_THIRD_ROUND_DATE[currChain] - offset;
  }

  return 0;
}

// mudar para uma variavel.
export function getEventHoldingAmount(
  chainId?: number,
): ethers.BigNumber | undefined {
  let currChain = chainId ? chainId : ChainId.Matic;

  if (currChain !== ChainId.Matic && chainId !== ChainId.Mumbai) {
    currChain = ChainId.Matic;
  }

  if (currChain) {
    return EVENT_HOLDING_AMOUNT[chainId as ChainId];
  }

  return EVENT_HOLDING_AMOUNT[ChainId.Matic];
}

export function GET_EVENT_HOLDING_AMOUNT(chanId?: number): number | string {
  const amount = getEventHoldingAmount(chanId);

  if (amount) {
    return ethers.utils.formatUnits(amount, 18);
  }

  return 0;
}

export function GET_EARLY_ACCESS_KIT_AMOUNT(chainId?: number): number {
  if (chainId) {
    if (chainId === ChainId.Matic || chainId === ChainId.Mumbai) {
      return EARLY_ACCESS_KIT_AMOUNT[chainId];
    }
  }

  return EARLY_ACCESS_KIT_AMOUNT[ChainId.Matic];
}

export function GET_EARLY_ACCESS_BITT_AMOUNT(chainId?: number): number {
  if (chainId) {
    if (chainId === ChainId.Matic || chainId === ChainId.Mumbai) {
      return EARLY_ACCESS_BITT_AMOUNT[chainId];
    }
  }

  return EARLY_ACCESS_BITT_AMOUNT[ChainId.Matic];
}
