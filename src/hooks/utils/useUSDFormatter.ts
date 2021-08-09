import {AppContext} from '@crema';
import {useContext} from 'react';
import AppContextPropsType from 'types/AppContextPropsType';

export const useUSDFormatter = () => {
  const {locale} = useContext<AppContextPropsType>(AppContext);

  const usdFormatter = new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: 'USD',
  });

  return {usdFormatter};
};
