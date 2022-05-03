import React from 'react';
import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as LovelyIcon} from 'assets/images/icons/lovely.svg';
import {ReactComponent as BuyCryptoIcon} from 'assets/images/icons/buy-crypto.svg';
import {ReactComponent as ElementPlusIcon} from 'assets/images/menu/grid/element-plus.svg';
import {ReactComponent as UserOctagonIcon} from 'assets/images/menu/users/user-octagon.svg';
import {ReactComponent as PeopleIcon} from 'assets/images/menu/users/people.svg';
import {ReactComponent as CupIcon} from 'assets/images/menu/essetional/cup.svg';
import {ReactComponent as DiscoverIcon} from 'assets/images/menu/essetional/discover.svg';
import {ReactComponent as RankingIcon} from 'assets/images/menu/essetional/ranking.svg';
import {ReactComponent as CoinLeagueIcon} from 'assets/images/menu/coinleague.svg';
import {ReactComponent as GameBoyIcon} from 'assets/images/menu/gameboy.svg';
import {ReactComponent as UserSearchIcon} from 'assets/images/menu/users/user-search.svg';
import {ReactComponent as SecurityIcon} from 'assets/images/menu/security/security.svg';
import {ReactComponent as QuestionIcon} from 'assets/images/menu/supportLikeQuestion/message-question.svg';
import {ReactComponent as JudgeIcon} from 'assets/images/icons/judge-menu.svg';

import {ReactComponent as DexKitIcon} from 'assets/images/icons/dexkit-menu.svg';
import {ReactComponent as GameIcon} from 'assets/images/menu/game.svg';
import {ReactComponent as DiagramIcon} from 'assets/images/menu/business/diagram.svg';
import {ReactComponent as ProfileCircleIcon} from 'assets/images/menu/users/profile-circle.svg';

import {ReactComponent as BitcoinConvertIcon} from 'assets/images/menu/bitcoin-convert.svg';
import {ReactComponent as MagicpenIcon} from 'assets/images/menu/magicpen.svg';
import {ReactComponent as ProfileTwoUserIcon} from 'assets/images/menu/users/profile-2user.svg';
import {ReactComponent as SettingFourIcon} from 'assets/images/menu/setting-4.svg';
import {ReactComponent as SiacoinScIcon} from 'assets/images/menu/siacoin-(sc).svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/menu/slider-horizontal.svg';
import {ReactComponent as StarIcon} from 'assets/images/menu/star.svg';

import {ReactComponent as UserIcon} from 'assets/images/menu/user.svg';
import {ReactComponent as WalletTwoIcon} from 'assets/images/menu/wallet-2.svg';

import {SettingsIcon} from './Icons';

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
  } else if (icon === 'gameboy') {
    return <GameBoyIcon {...props} />;
  } else if (icon === 'user.search') {
    return <UserSearchIcon {...props} />;
  } else if (icon === 'question') {
    return <QuestionIcon {...props} />;
  } else if (icon === 'cup') {
    return <CupIcon {...props} />;
  } else if (icon === 'game') {
    return <GameIcon {...props} />;
  } else if (icon === 'judge') {
    return <JudgeIcon {...props} />;
  } else if (icon === 'diagram') {
    return <DiagramIcon {...props} />;
  } else if (icon === 'dexkit') {
    return <DexKitIcon {...props} />;
  } else if (icon === 'settings') {
    return <SettingsIcon {...props} />;
  } else if (icon === 'profile') {
    return <ProfileCircleIcon {...props} />;
  } else if (icon === 'bitcoin-convert') {
    return <BitcoinConvertIcon {...props} />;
  } else if (icon === 'magicpen') {
    return <MagicpenIcon {...props} />;
  } else if (icon === 'profile-2user') {
    return <ProfileTwoUserIcon {...props} />;
  } else if (icon === 'settings-4') {
    return <SettingFourIcon {...props} />;
  } else if (icon === 'siacoin-sc') {
    return <SiacoinScIcon {...props} />;
  } else if (icon === 'slider-horizontal') {
    return <SliderHorizontalIcon {...props} />;
  } else if (icon === 'star') {
    return <StarIcon {...props} />;
  } else if (icon === 'user') {
    return <UserIcon {...props} />;
  } else if (icon === 'wallet-2') {
    return <WalletTwoIcon {...props} />;
  } else if (icon === 'discover') {
    return <DiscoverIcon {...props} />;
  } else if (icon === 'ranking') {
    return <RankingIcon {...props} />;
  } else if (icon === 'security') {
    return <SecurityIcon {...props} />;
  } else if (icon === 'people') {
    return <PeopleIcon {...props} />;
  }

  return <></>;
};

export default CustomIcon;
