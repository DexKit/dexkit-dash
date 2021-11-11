import {ethers} from 'ethers';
import {FIRST_ROUND_DATE} from '../constants';
import {ChampionsEventRound} from './types';

export function getEventCurrentRound(): ChampionsEventRound {
  return ChampionsEventRound.FIRST;
}

export function getEventAccessDate(
  round: ChampionsEventRound,
  offset: number = 0,
): number {
  return FIRST_ROUND_DATE - offset;
}

// mudar para uma variavel.
export function getEventHoldingAmount(): ethers.BigNumber {
  return ethers.BigNumber.from(ethers.utils.formatUnits(100, 'wei'));
}
