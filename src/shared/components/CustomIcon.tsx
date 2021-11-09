import React from 'react';
import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as BitcoinConvertIcon} from 'assets/images/icons/bitcoin-convert.svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/icons/slider-horizontal.svg';
import {ReactComponent as LovelyIcon} from 'assets/images/icons/lovely.svg';
import {ReactComponent as BuyCryptoIcon} from 'assets/images/icons/buy-crypto.svg';
import {ReactComponent as ElementPlusIcon} from 'assets/images/icons/element-plus.svg';
import {ReactComponent as UserOctagonIcon} from 'assets/images/icons/user-octagon.svg';
import {ReactComponent as CupIcon} from 'assets/images/icons/cup-menu.svg';
import {ReactComponent as CoinLeagueIcon} from 'assets/images/icons/coinleague.svg';
import {ReactComponent as GameBoyIcon} from 'assets/images/icons/gameboy.svg';
import {ReactComponent as UserSearchIcon} from 'assets/images/icons/user-search-menu.svg';
import {ReactComponent as QuestionIcon} from 'assets/images/icons/question.svg';
import {ReactComponent as GameIcon} from 'assets/images/icons/game-menu.svg';
import {MagicpenIcon} from './Icons';

interface Props extends React.SVGProps<SVGSVGElement> {
  icon: string;
}

export const CustomIcon = (props: Props) => {
  const {icon} = props;

  if (icon === 'money.wallet') {
    return <MoneyWalletIcon {...props} />;
  } else if (icon === 'bitcoin.convert') {
    return <BitcoinConvertIcon {...props} />;
  } else if (icon === 'slider.horizontal') {
    return <SliderHorizontalIcon {...props} />;
  } else if (icon === 'lovely') {
    return <LovelyIcon {...props} />;
  } else if (icon === 'buy.crypto') {
    return <BuyCryptoIcon {...props} />;
  } else if (icon === 'element.plus') {
    return <ElementPlusIcon {...props} />;
  } else if (icon === 'user.octagon') {
    return <UserOctagonIcon {...props} />;
  } else if (icon === 'magicpen') {
    return <MagicpenIcon {...props} />;
  } else if (icon === 'coinleague') {
    return <CoinLeagueIcon {...props} />;
  }else if (icon === 'gameboy') {
    return <GameBoyIcon {...props} />;
  }else if (icon === 'user.search') {
    return <UserSearchIcon {...props} />;
  }else if (icon === 'question') {
    return <QuestionIcon {...props} />;
  } else if (icon === 'cup') {
    return <CupIcon {...props} />;
  }else if (icon === 'question') {
    return <QuestionIcon {...props} />;
  }else if (icon === 'game') {
    return <GameIcon {...props} />;
  }

  return <></>;
};

export default CustomIcon;
