import {BigNumber} from 'ethers';
import {ChainId} from 'types/blockchain';

export const METADATA_KITTY_ENDPOINT = 'https://kittygotchi.dexkit.com/api/';

export const GAS_PRICE_MULTIPLIER = 2;

export const PRICE = {
  // 10 Matic
  [ChainId.Matic]: BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
  [ChainId.Mumbai]: BigNumber.from(100),
};

export const GET_KITTY_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId && chainId === ChainId.Mumbai) {
    return ChainId.Mumbai;
  }
  return ChainId.Matic;
};

export const KITTYGOTCHI = {
  [ChainId.Matic]: '0xEA88540adb1664999524d1a698cb84F6C922D2A1',
  [ChainId.Mumbai]: '0xbdd0C521aBb19fA863917e2C807f327957D239ff',
};

export enum KittygotchiTraitType {
  ACESSOIRES,
  BODY,
  CLOTHES,
  EARS,
  EYES,
  MOUTH,
  NOSE,
}

export interface KittygotchiTraitItem {
  holding: number;
  value: string;
}

export const KittygotchiTraits = {
  [KittygotchiTraitType.ACESSOIRES]: [
    {
      value: 'Flower',
      holding: 20,
    },
    {
      value: 'Hat',
      holding: 50,
    },
    {
      value: 'Headphones',
      holding: 100,
    },
    {
      value: 'Piercing',
      holding: 500,
    },
    {
      value: 'Punk hair',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.BODY]: [
    {
      value: 'body',
      holding: 0,
    },
  ],
  [KittygotchiTraitType.CLOTHES]: [
    {
      value: 'Dance',
      holding: 20,
    },
    {
      value: 'Job',
      holding: 50,
    },
    {
      value: 'Love date',
      holding: 100,
    },
    {
      value: 'School',
      holding: 500,
    },
    {
      value: 'Tour',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.EARS]: [
    {
      value: 'Fun',
      holding: 20,
    },
    {
      value: 'Pointed',
      holding: 50,
    },
    {
      value: 'Rounded',
      holding: 500,
    },
  ],
  [KittygotchiTraitType.EYES]: [
    {
      value: 'Canoe',
      holding: 20,
    },
    {
      value: 'Circle',
      holding: 50,
    },
    {
      value: 'Eyeliner',
      holding: 100,
    },
    {
      value: 'Flash',
      holding: 500,
    },
    {
      value: 'Star',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.MOUTH]: [
    {
      value: 'Angry',
      holding: 20,
    },
    {
      value: 'Cute',
      holding: 50,
    },
    {
      value: 'Happy',
      holding: 100,
    },
    {
      value: 'Over the moon',
      holding: 500,
    },
    {
      value: 'Sad',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.NOSE]: [
    {
      value: 'Ellipse',
      holding: 20,
    },
    {
      value: 'Fan',
      holding: 50,
    },
    {
      value: 'Pug-nose',
      holding: 100,
    },
    {
      value: 'Rhombus',
      holding: 500,
    },
    {
      value: 'Small',
      holding: 5000,
    },
  ],
};
