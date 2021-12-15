import {BigNumber} from 'ethers';

export interface Kittygotchi {
  id: string;
  attack: number;
  defense: number;
  run: number;
  image?: string;
  description?: string;
  name?: string;
  attributes?: any;
  lastUpdated?: number;
}
