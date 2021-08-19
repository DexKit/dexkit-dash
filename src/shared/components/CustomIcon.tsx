import React from 'react';
import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/wallet-money.svg';
import {ReactComponent as BitcoinConvertIcon} from 'assets/images/icons/bitcoin-convert.svg';
import {ReactComponent as SliderHorizontalIcon} from 'assets/images/icons/slider-horizontal.svg';
import {ReactComponent as LovelyIcon} from 'assets/images/icons/lovely.svg';
import {ReactComponent as BuyCryptoIcon} from 'assets/images/icons/buy-crypto.svg';
import {ReactComponent as ElementPlusIcon} from 'assets/images/icons/element-plus.svg';
import {ReactComponent as UserOctagonIcon} from 'assets/images/icons/user-octagon.svg';
import {makeStyles} from '@material-ui/core';

interface Props extends React.SVGProps<SVGSVGElement> {
  icon: string;
}

export const CustomIcon = (props: Props) => {
  const {icon, fill} = props;

  if (icon == 'money.wallet') {
    return <MoneyWalletIcon {...props} />;
  } else if (icon == 'bitcoin.convert') {
    return <BitcoinConvertIcon {...props} />;
  } else if (icon == 'slider.horizontal') {
    return <SliderHorizontalIcon {...props} />;
  } else if (icon == 'lovely') {
    return <LovelyIcon {...props} />;
  } else if (icon == 'buy.crypto') {
    return <BuyCryptoIcon {...props} />;
  } else if (icon == 'element.plus') {
    return <ElementPlusIcon {...props} />;
  } else if (icon == 'user.octagon') {
    return <UserOctagonIcon {...props} />;
  }

  return <></>;
};

export default CustomIcon;
