import {BigNumber} from 'ethers';

export interface Kittygotchi {
  id: string;
  attack: BigNumber;
  defense: BigNumber;
  run: BigNumber;
  image?: string;
  attributes?: any;
}
