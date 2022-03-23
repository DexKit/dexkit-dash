import { BigNumber } from 'ethers';
import { ChainId } from 'types/blockchain';

export const KITTYGOTCHI_METADATA_ENDPOINT =
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
  [ChainId.Binance]: '0xf44112926506318e3Aace4381B2D76791D980Ac3',
  [ChainId.Mainnet]: '0xe76591AD590765e9Ab9EdE82BEa274aFcF5Ce703',
};

export const GET_KITTYGOTCHI_CONTRACT_ADDR = (chainId?: number) => {
  if (
    chainId === ChainId.Matic ||
    chainId === ChainId.Mumbai ||
    chainId === ChainId.Binance ||
    chainId === ChainId.Mainnet
  ) {
    return KITTYGOTCHI[chainId];
  }

  return undefined;
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
      value: 'headphones2',
      path: 'headphones2',
      holding: 250,
    },
    {
      value: 'flower',
      path: 'flower',
      holding: 500,
    },
    {
      value: 'cap',
      path: 'cap',
      holding: 1000,
    },
    {
      value: 'winter',
      path: 'winter',
      holding: 3000,
    },
    {
      value: 'astro-helmet',
      path: 'astro-helmet',
      holding: 3000,
    },
    {
      value: 'punk-hair',
      path: 'punk-hair',
      holding: 5000,
    },
    {
      value: 'crown',
      path: 'crown',
      holding: 10000,
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
      value: 'astronaut',
      path: 'astronaut',
      holding: 250,
    },
    {
      value: 'school',
      path: 'school',
      holding: 500,
    },
    {
      value: 'bad-boy',
      path: 'bad-boy',
      holding: 1000,
    },
    {
      value: 'scarf',
      path: 'scarf',
      holding: 2000,
    },
    {
      value: 'hippie',
      path: 'hippie',
      holding: 3000,
    },
    {
      value: 'tie',
      path: 'tie',
      holding: 4000,
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
      value: 'alert',
      path: 'alert',
      holding: 250,
    },
    {
      value: 'rounded',
      path: 'rounded',
      holding: 500,
    },
    {
      value: 'angora',
      path: 'angora',
      holding: 1000,
    },
    {
      value: 'lynx',
      path: 'lynx',
      holding: 2000,
    },
    {
      value: 'rounded2',
      path: 'rounded2',
      holding: 3000,
    },
    {
      value: 'short',
      path: 'short',
      holding: 4000,
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
      value: 'cute',
      path: 'cute',
      holding: 250,
    },
    {
      value: 'flash',
      path: 'flash',
      holding: 500,
    },
    {
      value: 'beach-glasses',
      path: 'beach-glasses',
      holding: 1000,
    },
    {
      value: 'love',
      path: 'love',
      holding: 2000,
    },
    {
      value: 'thunder',
      path: 'thunder',
      holding: 3000,
    },
    {
      value: 'canoe',
      path: 'canoe',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.MOUTH]: [
    {
      value: 'cute',
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
      value: 'cute-smile',
      path: 'cute-smile',
      holding: 250,
    },
    {
      value: 'over-the-moon',
      path: 'over-the-moon',
      holding: 500,
    },
    {
      value: 'mask',
      path: 'mask',
      holding: 1000,
    },
    {
      value: 'mustache',
      path: 'mustache',
      holding: 2000,
    },
    {
      value: 'smile',
      path: 'smile',
      holding: 3000,
    }, {
      value: 'teeth',
      path: 'teeth',
      holding: 4000,
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
      value: 'little-mustache',
      path: 'little-mustache',
      holding: 250,
    },
    {
      value: 'rhombus',
      path: 'rhombus',
      holding: 500,
    },
    {
      value: 'love',
      path: 'love',
      holding: 1000,
    },
    {
      value: 'pig',
      path: 'pig',
      holding: 2000,
    },
    {
      value: 'septum',
      path: 'septum',
      holding: 3000,
    },
    {
      value: 'tiny',
      path: 'tiny',
      holding: 4000,
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
  // new
  'accessories/astro-helmet.png': require('assets/images/kittygotchi/accessories/astro-helmet.png'),
  'accessories/cap.png': require('assets/images/kittygotchi/accessories/cap.png'),
  'accessories/crown.png': require('assets/images/kittygotchi/accessories/crown.png'),
  'accessories/headphones2.png': require('assets/images/kittygotchi/accessories/headphones2.png'),
  'accessories/winter.png': require('assets/images/kittygotchi/accessories/winter.png'),
  'clothes/job.png': require('assets/images/kittygotchi/clothes/job.png'),
  'clothes/dance.png': require('assets/images/kittygotchi/clothes/dance.png'),
  'clothes/love-date.png': require('assets/images/kittygotchi/clothes/love-date.png'),
  'clothes/school.png': require('assets/images/kittygotchi/clothes/school.png'),
  'clothes/tour.png': require('assets/images/kittygotchi/clothes/tour.png'),
  // new
  'clothes/astronaut.png': require('assets/images/kittygotchi/clothes/astronaut.png'),
  'clothes/bad-boy.png': require('assets/images/kittygotchi/clothes/bad-boy.png'),
  'clothes/hippie.png': require('assets/images/kittygotchi/clothes/hippie.png'),
  'clothes/scarf.png': require('assets/images/kittygotchi/clothes/scarf.png'),
  'clothes/tie.png': require('assets/images/kittygotchi/clothes/tie.png'),
  'ears/fun.png': require('assets/images/kittygotchi/ears/fun.png'),
  'ears/pointed.png': require('assets/images/kittygotchi/ears/pointed.png'),
  'ears/rounded.png': require('assets/images/kittygotchi/ears/rounded.png'),
  // new
  'ears/alert.png': require('assets/images/kittygotchi/ears/alert.png'),
  'ears/angora.png': require('assets/images/kittygotchi/ears/angora.png'),
  'ears/lynx.png': require('assets/images/kittygotchi/ears/lynx.png'),
  'ears/rounded2.png': require('assets/images/kittygotchi/ears/rounded2.png'),
  'ears/short.png': require('assets/images/kittygotchi/ears/short.png'),
  'eyes/circle.png': require('assets/images/kittygotchi/eyes/circle.png'),
  'eyes/canoe.png': require('assets/images/kittygotchi/eyes/canoe.png'),
  'eyes/eyeliner.png': require('assets/images/kittygotchi/eyes/eyeliner.png'),
  'eyes/flash.png': require('assets/images/kittygotchi/eyes/flash.png'),
  'eyes/star.png': require('assets/images/kittygotchi/eyes/star.png'),
  // new
  'eyes/beach-glasses.png': require('assets/images/kittygotchi/eyes/beach-glasses.png'),
  'eyes/code-glasses.png': require('assets/images/kittygotchi/eyes/code-glasses.png'),
  'eyes/cute.png': require('assets/images/kittygotchi/eyes/cute.png'),
  'eyes/love.png': require('assets/images/kittygotchi/eyes/love.png'),
  'eyes/thunder.png': require('assets/images/kittygotchi/eyes/thunder.png'),
  'mouth/angry.png': require('assets/images/kittygotchi/mouth/angry.png'),
  'mouth/cute.png': require('assets/images/kittygotchi/mouth/cute.png'),
  'mouth/happy.png': require('assets/images/kittygotchi/mouth/happy.png'),
  'mouth/over-the-moon.png': require('assets/images/kittygotchi/mouth/over-the-moon.png'),
  'mouth/sad.png': require('assets/images/kittygotchi/mouth/sad.png'),
  // new
  'mouth/cute-smile.png': require('assets/images/kittygotchi/mouth/cute-smile.png'),
  'mouth/mask.png': require('assets/images/kittygotchi/mouth/mask.png'),
  'mouth/mustache.png': require('assets/images/kittygotchi/mouth/mustache.png'),
  'mouth/smile.png': require('assets/images/kittygotchi/mouth/smile.png'),
  'mouth/teeth.png': require('assets/images/kittygotchi/mouth/teeth.png'),
  'nose/ellipse.png': require('assets/images/kittygotchi/nose/ellipse.png'),
  'nose/fan.png': require('assets/images/kittygotchi/nose/fan.png'),
  'nose/pug-nose.png': require('assets/images/kittygotchi/nose/pug-nose.png'),
  'nose/rhombus.png': require('assets/images/kittygotchi/nose/rhombus.png'),
  'nose/small.png': require('assets/images/kittygotchi/nose/small.png'),
  // new
  'nose/little-mustache.png': require('assets/images/kittygotchi/nose/little-mustache.png'),
  'nose/love.png': require('assets/images/kittygotchi/nose/love.png'),
  'nose/pig.png': require('assets/images/kittygotchi/nose/pig.png'),
  'nose/septum.png': require('assets/images/kittygotchi/nose/septum.png'),
  'nose/tiny.png': require('assets/images/kittygotchi/nose/tiny.png'),
};

export const IMAGE_PATHS_ICONS: any = {
  'accessories/flower.png': require('assets/images/kittygotchi/icons/accessories/flower.png'),
  'accessories/hat.png': require('assets/images/kittygotchi/icons/accessories/hat.png'),
  'accessories/headphones.png': require('assets/images/kittygotchi/icons/accessories/headphones.png'),
  'accessories/punk-hair.png': require('assets/images/kittygotchi/icons/accessories/punk-hair.png'),
  'accessories/piercing.png': require('assets/images/kittygotchi/icons/accessories/piercing.png'),
  // new
  'accessories/astro-helmet.png': require('assets/images/kittygotchi/accessories/astro-helmet.png'),
  'accessories/cap.png': require('assets/images/kittygotchi/accessories/cap.png'),
  'accessories/crown.png': require('assets/images/kittygotchi/accessories/crown.png'),
  'accessories/headphones2.png': require('assets/images/kittygotchi/accessories/headphones2.png'),
  'accessories/winter.png': require('assets/images/kittygotchi/accessories/winter.png'),
  'clothes/job.png': require('assets/images/kittygotchi/icons/clothes/job.png'),
  'clothes/dance.png': require('assets/images/kittygotchi/icons/clothes/dance.png'),
  'clothes/love-date.png': require('assets/images/kittygotchi/icons/clothes/love-date.png'),
  'clothes/school.png': require('assets/images/kittygotchi/icons/clothes/school.png'),
  'clothes/tour.png': require('assets/images/kittygotchi/icons/clothes/tour.png'),
  // new
  'clothes/astronaut.png': require('assets/images/kittygotchi/clothes/astronaut.png'),
  'clothes/bad-boy.png': require('assets/images/kittygotchi/clothes/bad-boy.png'),
  'clothes/hippie.png': require('assets/images/kittygotchi/clothes/hippie.png'),
  'clothes/scarf.png': require('assets/images/kittygotchi/clothes/scarf.png'),
  'clothes/tie.png': require('assets/images/kittygotchi/clothes/tie.png'),
  'ears/fun.png': require('assets/images/kittygotchi/icons/ears/fun.png'),
  'ears/pointed.png': require('assets/images/kittygotchi/icons/ears/pointed.png'),
  'ears/rounded.png': require('assets/images/kittygotchi/icons/ears/rounded.png'),
  // new
  'ears/alert.png': require('assets/images/kittygotchi/ears/alert.png'),
  'ears/angora.png': require('assets/images/kittygotchi/ears/angora.png'),
  'ears/lynx.png': require('assets/images/kittygotchi/ears/lynx.png'),
  'ears/rounded2.png': require('assets/images/kittygotchi/ears/rounded2.png'),
  'ears/short.png': require('assets/images/kittygotchi/ears/short.png'),
  'eyes/circle.png': require('assets/images/kittygotchi/icons/eyes/circle.png'),
  'eyes/canoe.png': require('assets/images/kittygotchi/icons/eyes/canoe.png'),
  'eyes/eyeliner.png': require('assets/images/kittygotchi/icons/eyes/eyeliner.png'),
  'eyes/flash.png': require('assets/images/kittygotchi/icons/eyes/flash.png'),
  'eyes/star.png': require('assets/images/kittygotchi/icons/eyes/star.png'),
  // new
  'eyes/beach-glasses.png': require('assets/images/kittygotchi/eyes/beach-glasses.png'),
  'eyes/code-glasses.png': require('assets/images/kittygotchi/eyes/code-glasses.png'),
  'eyes/cute.png': require('assets/images/kittygotchi/eyes/cute.png'),
  'eyes/love.png': require('assets/images/kittygotchi/eyes/love.png'),
  'eyes/thunder.png': require('assets/images/kittygotchi/eyes/thunder.png'),
  'mouth/angry.png': require('assets/images/kittygotchi/icons/mouth/angry.png'),
  'mouth/cute.png': require('assets/images/kittygotchi/icons/mouth/cute.png'),
  'mouth/happy.png': require('assets/images/kittygotchi/icons/mouth/happy.png'),
  'mouth/over-the-moon.png': require('assets/images/kittygotchi/icons/mouth/over-the-moon.png'),
  'mouth/sad.png': require('assets/images/kittygotchi/icons/mouth/sad.png'),
  // new
  'mouth/cute-smile.png': require('assets/images/kittygotchi/mouth/cute-smile.png'),
  'mouth/mask.png': require('assets/images/kittygotchi/mouth/mask.png'),
  'mouth/mustache.png': require('assets/images/kittygotchi/mouth/mustache.png'),
  'mouth/smile.png': require('assets/images/kittygotchi/mouth/smile.png'),
  'mouth/teeth.png': require('assets/images/kittygotchi/mouth/teeth.png'),
  'nose/ellipse.png': require('assets/images/kittygotchi/icons/nose/ellipse.png'),
  'nose/fan.png': require('assets/images/kittygotchi/icons/nose/fan.png'),
  'nose/pug-nose.png': require('assets/images/kittygotchi/icons/nose/pug-nose.png'),
  'nose/rhombus.png': require('assets/images/kittygotchi/icons/nose/rhombus.png'),
  'nose/small.png': require('assets/images/kittygotchi/icons/nose/small.png'),
  // new
  'nose/little-mustache.png': require('assets/images/kittygotchi/nose/little-mustache.png'),
  'nose/love.png': require('assets/images/kittygotchi/nose/love.png'),
  'nose/pig.png': require('assets/images/kittygotchi/nose/pig.png'),
  'nose/septum.png': require('assets/images/kittygotchi/nose/septum.png'),
  'nose/tiny.png': require('assets/images/kittygotchi/nose/tiny.png'),
};

export const KITTYGOTCHI_EDIT_MIN_AMOUNT = 20;
