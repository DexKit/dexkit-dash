import {BigNumber, ethers} from 'ethers';
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
  ACCESSORIES,
  BODY,
  CLOTHES,
  EARS,
  EYES,
  MOUTH,
  NOSE,
}

export const KittygotchiTraits: any = {
  [KittygotchiTraitType.ACCESSORIES]: [
    {
      value: 'piercing',
      path: 'piercing',
      holding: 20,
    },
    {
      value: 'hat',
      path: 'hat',
      holding: 50,
    },
    {
      value: 'headphones',
      path: 'headphones',
      holding: 100,
    },
    {
      value: 'flower',
      path: 'flower',
      holding: 500,
    },
    {
      value: 'punk-hair',
      path: 'punk-hair',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.BODY]: [
    {
      value: 'body',
      path: 'body',
      holding: 0,
    },
  ],
  [KittygotchiTraitType.CLOTHES]: [
    {
      value: 'dance',
      path: 'dance',
      holding: 20,
    },
    {
      value: 'job',
      path: 'job',
      holding: 50,
    },
    {
      value: 'love-date',
      path: 'love-date',
      holding: 100,
    },
    {
      value: 'school',
      path: 'school',
      holding: 500,
    },
    {
      value: 'tour',
      path: 'tour',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.EARS]: [
    {
      value: 'pointed',
      path: 'pointed',
      holding: 20,
    },
    {
      value: 'fun',
      path: 'fun',
      holding: 50,
    },
    {
      value: 'rounded',
      path: 'rounded',
      holding: 500,
    },
  ],
  [KittygotchiTraitType.EYES]: [
    {
      value: 'star',
      path: 'star',
      holding: 20,
    },
    {
      value: 'circle',
      path: 'circle',
      holding: 50,
    },
    {
      value: 'eyeliner',
      path: 'eyeliner',
      holding: 100,
    },
    {
      value: 'flash',
      path: 'flash',
      holding: 500,
    },
    {
      value: 'canoe',
      path: 'canoe',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.MOUTH]: [
    {
      value: 'Cute',
      path: 'cute',
      holding: 20,
    },
    {
      value: 'angry',
      path: 'angry',
      holding: 50,
    },
    {
      value: 'happy',
      path: 'happy',
      holding: 100,
    },
    {
      value: 'over-the-moon',
      path: 'over-the-moon',
      holding: 500,
    },
    {
      value: 'sad',
      path: 'sad',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.NOSE]: [
    {
      value: 'fan',
      path: 'fan',
      holding: 20,
    },
    {
      value: 'ellipse',
      path: 'ellipse',
      holding: 50,
    },
    {
      value: 'pug-nose',
      path: 'pug-nose',
      holding: 100,
    },
    {
      value: 'rhombus',
      path: 'rhombus',
      holding: 500,
    },
    {
      value: 'small',
      path: 'small',
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
  'clothes/job.png': require('assets/images/kittygotchi/clothes/job.png'),
  'clothes/dance.png': require('assets/images/kittygotchi/clothes/dance.png'),
  'clothes/love-date.png': require('assets/images/kittygotchi/clothes/love-date.png'),
  'clothes/school.png': require('assets/images/kittygotchi/clothes/school.png'),
  'clothes/tour.png': require('assets/images/kittygotchi/clothes/tour.png'),
  'ears/fun.png': require('assets/images/kittygotchi/ears/fun.png'),
  'ears/pointed.png': require('assets/images/kittygotchi/ears/pointed.png'),
  'ears/rounded.png': require('assets/images/kittygotchi/ears/rounded.png'),
  'eyes/circle.png': require('assets/images/kittygotchi/eyes/circle.png'),
  'eyes/canoe.png': require('assets/images/kittygotchi/eyes/canoe.png'),
  'eyes/eyeliner.png': require('assets/images/kittygotchi/eyes/eyeliner.png'),
  'eyes/flash.png': require('assets/images/kittygotchi/eyes/flash.png'),
  'eyes/star.png': require('assets/images/kittygotchi/eyes/star.png'),
  'mouth/angry.png': require('assets/images/kittygotchi/mouth/angry.png'),
  'mouth/cute.png': require('assets/images/kittygotchi/mouth/cute.png'),
  'mouth/happy.png': require('assets/images/kittygotchi/mouth/happy.png'),
  'mouth/over-the-moon.png': require('assets/images/kittygotchi/mouth/over-the-moon.png'),
  'mouth/sad.png': require('assets/images/kittygotchi/mouth/sad.png'),
  'nose/ellipse.png': require('assets/images/kittygotchi/nose/ellipse.png'),
  'nose/fan.png': require('assets/images/kittygotchi/nose/fan.png'),
  'nose/pug-nose.png': require('assets/images/kittygotchi/nose/pug-nose.png'),
  'nose/rhombus.png': require('assets/images/kittygotchi/nose/rhombus.png'),
  'nose/small.png': require('assets/images/kittygotchi/nose/small.png'),
};

export const IMAGE_PATHS_ICONS: any = {
  'accessories/flower.png': require('assets/images/kittygotchi/icons/accessories/flower.png'),
  'accessories/hat.png': require('assets/images/kittygotchi/icons/accessories/hat.png'),
  'accessories/headphones.png': require('assets/images/kittygotchi/icons/accessories/headphones.png'),
  'accessories/punk-hair.png': require('assets/images/kittygotchi/icons/accessories/punk-hair.png'),
  'accessories/piercing.png': require('assets/images/kittygotchi/icons/accessories/piercing.png'),
  'clothes/job.png': require('assets/images/kittygotchi/icons/clothes/job.png'),
  'clothes/dance.png': require('assets/images/kittygotchi/icons/clothes/dance.png'),
  'clothes/love-date.png': require('assets/images/kittygotchi/icons/clothes/love-date.png'),
  'clothes/school.png': require('assets/images/kittygotchi/icons/clothes/school.png'),
  'clothes/tour.png': require('assets/images/kittygotchi/icons/clothes/tour.png'),
  'ears/fun.png': require('assets/images/kittygotchi/icons/ears/fun.png'),
  'ears/pointed.png': require('assets/images/kittygotchi/icons/ears/pointed.png'),
  'ears/rounded.png': require('assets/images/kittygotchi/icons/ears/rounded.png'),
  'eyes/circle.png': require('assets/images/kittygotchi/icons/eyes/circle.png'),
  'eyes/canoe.png': require('assets/images/kittygotchi/icons/eyes/canoe.png'),
  'eyes/eyeliner.png': require('assets/images/kittygotchi/icons/eyes/eyeliner.png'),
  'eyes/flash.png': require('assets/images/kittygotchi/icons/eyes/flash.png'),
  'eyes/star.png': require('assets/images/kittygotchi/icons/eyes/star.png'),
  'mouth/angry.png': require('assets/images/kittygotchi/icons/mouth/angry.png'),
  'mouth/cute.png': require('assets/images/kittygotchi/icons/mouth/cute.png'),
  'mouth/happy.png': require('assets/images/kittygotchi/icons/mouth/happy.png'),
  'mouth/over-the-moon.png': require('assets/images/kittygotchi/icons/mouth/over-the-moon.png'),
  'mouth/sad.png': require('assets/images/kittygotchi/icons/mouth/sad.png'),
  'nose/ellipse.png': require('assets/images/kittygotchi/icons/nose/ellipse.png'),
  'nose/fan.png': require('assets/images/kittygotchi/icons/nose/fan.png'),
  'nose/pug-nose.png': require('assets/images/kittygotchi/icons/nose/pug-nose.png'),
  'nose/rhombus.png': require('assets/images/kittygotchi/icons/nose/rhombus.png'),
  'nose/small.png': require('assets/images/kittygotchi/icons/nose/small.png'),
};

export const KITTYGOTCHI_EDIT_MIN_AMOUNT = 20;
