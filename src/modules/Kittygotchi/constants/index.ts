import {BigNumber} from 'ethers';
import {ChainId} from 'types/blockchain';

export const POLYGON_METADATA_KITTY_ENDPOINT =
  'https://kittygotchi.dexkit.com/api/';
export const MUMBAI_METADATA_KITTY_ENDPOINT = //'http://localhost:3001/api/'
  'https://mumbai-kittygotchi.dexkit.com/api/';

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

export const KittygotchiTraits = {
  [KittygotchiTraitType.ACESSOIRES]: [
    {
      value: 'flower',
      holding: 20,
    },
    {
      value: 'hat',
      holding: 50,
    },
    {
      value: 'headphones',
      holding: 100,
    },
    {
      value: 'piercing',
      holding: 500,
    },
    {
      value: 'punk-hair',
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
      value: 'love-date',
      holding: 100,
    },
    {
      value: 'school',
      holding: 500,
    },
    {
      value: 'tour',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.EARS]: [
    {
      value: 'fun',
      holding: 20,
    },
    {
      value: 'pointed',
      holding: 50,
    },
    {
      value: 'rounded',
      holding: 500,
    },
  ],
  [KittygotchiTraitType.EYES]: [
    {
      value: 'canoe',
      holding: 20,
    },
    {
      value: 'circle',
      holding: 50,
    },
    {
      value: 'eyeliner',
      holding: 100,
    },
    {
      value: 'flash',
      holding: 500,
    },
    {
      value: 'star',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.MOUTH]: [
    {
      value: 'angry',
      holding: 20,
    },
    {
      value: 'cute',
      holding: 50,
    },
    {
      value: 'happy',
      holding: 100,
    },
    {
      value: 'over-the-moon',
      holding: 500,
    },
    {
      value: 'sad',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.NOSE]: [
    {
      value: 'ellipse',
      holding: 20,
    },
    {
      value: 'fan',
      holding: 50,
    },
    {
      value: 'pug-nose',
      holding: 100,
    },
    {
      value: 'rhombus',
      holding: 500,
    },
    {
      value: 'small',
      holding: 5000,
    },
  ],
};

export const KITTY_TRAITS_ITEM_URL =
  'https://dexkit-storage.nyc3.digitaloceanspaces.com/kittygotchi';

export const IMAGE_PATHS: any = {
  'body/body.png': require('assets/images/kittygotchi/body/body.png'),
  'accessories/flower.png': require('assets/images/kittygotchi/accessories/flower.png'),
  'accessories/hat.png': require('assets/images/kittygotchi/accessories/hat.png'),
  'accessories/headphones.png': require('assets/images/kittygotchi/accessories/headphones.png'),
  'accessories/punk-hair.png': require('assets/images/kittygotchi/accessories/punk-hair.png'),
  'accessories/piercing.png': require('assets/images/kittygotchi/accessories/piercing.png'),
  'clothes/clothes.png': require('assets/images/kittygotchi/clothes/dance.png'),
  'clothes/job.png': require('assets/images/kittygotchi/clothes/job.png'),
  'clothes/love-date.png': require('assets/images/kittygotchi/clothes/love-date.png'),
  'clothes/school.png': require('assets/images/kittygotchi/clothes/school.png'),
  'clothes/tour.png': require('assets/images/kittygotchi/clothes/tour.png'),
  'ears/fun.png': require('assets/images/kittygotchi/ears/fun.png'),
  'ears/pointed.png': require('assets/images/kittygotchi/ears/pointed.png'),
  'ears/rounded.png': require('assets/images/kittygotchi/ears/rounded.png'),
  'eyes/circle.png': require('assets/images/kittygotchi/eyes/circle.png'),
  'eyes/canoe.png': require('assets/images/kittygotchi/eyes/circle.png'),
  'eyes/flash.png': require('assets/images/kittygotchi/eyes/flash.png'),
  'eyes/star.png': require('assets/images/kittygotchi/eyes/star.png'),
  'mouth/angry.png': require('assets/images/kittygotchi/mouth/angry.png'),
  'mouth/cute.png': require('assets/images/kittygotchi/mouth/cute.png'),
  'mouth/happy.png': require('assets/images/kittygotchi/mouth/happy.png'),
  'mouth/over-the-moon.png': require('assets/images/kittygotchi/mouth/over-the-moon.png'),
  'nose/ellipse.png': require('assets/images/kittygotchi/nose/ellipse.png'),
  'nose/fan.png': require('assets/images/kittygotchi/nose/fan.png'),
  'nose/pug-nose.png': require('assets/images/kittygotchi/nose/pug-nose.png'),
  'nose/rhombus.png': require('assets/images/kittygotchi/nose/rhombus.png'),
  'nose/small.png': require('assets/images/kittygotchi/nose/small.png'),
};
