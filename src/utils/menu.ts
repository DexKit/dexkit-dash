import {ReactComponent as MoneyWalletIcon} from 'assets/images/icons/money-wallet.svg';

export function getCustomIcon(name: string) {
  switch (name) {
    case 'money.wallet':
      return MoneyWalletIcon;
  }
}
