import React, {useEffect, useState} from 'react';
import defaultConfig from './defaultConfig';
import defaultDarkConfig from './defaultDarkConfig';
import AppContext from '../AppContext';
import PropTypes from 'prop-types';
import {ThemeMode} from '../../../shared/constants/AppEnums';
import routes from '../../../modules';
import {Theme} from '@material-ui/core';

const ContextProvider: React.FC<React.ReactNode> = ({children}) => {
  const [theme, updateTheme] = useState(defaultDarkConfig.theme); // FIXME: change in the future
  const [footer, setFooter] = useState(defaultConfig.footer);
  const [footerType, setFooterType] = useState(defaultConfig.footerType);
  const [themeMode, updateMode] = useState(defaultConfig.themeMode);
  const [themeStyle, updateThemeStyle] = useState(defaultConfig.themeStyle);
  const [layoutType, updateLayoutStyle] = useState(defaultConfig.layoutType);
  const [isRTL, setRtl] = useState(defaultConfig.theme.direction === 'rtl');
  const [locale, changeLocale] = useState(defaultConfig.locale);
  const [navStyle, changeNavStyle] = useState(defaultConfig.navStyle);
  const [rtAnim, changeRTAnim] = useState(defaultConfig.rtAnim);

  const [primary, updatePrimaryColor] = useState(
    defaultConfig.theme.palette.primary.main,
  );
  const [sidebarColor, updateSidebarColor] = useState(
    defaultConfig.theme.palette.sidebar.bgColor,
  );
  const [secondary, updateSecondaryColor] = useState(
    defaultConfig.theme.palette.secondary.main,
  );

  const updateThemeMode = (themeMode: ThemeMode) => {
    // let currentTheme: Theme = defaultConfig.theme;

    // if (themeMode === ThemeMode.DARK) {
    //   currentTheme = defaultDarkConfig.theme;
    // }

    updateTheme(defaultDarkConfig.theme);
  };

  const setRTL = (rtl: boolean) => {
    if (rtl) {
      theme.direction = 'rtl';
    } else {
      theme.direction = 'ltr';
    }
    updateTheme(theme);
    setRtl(rtl);
  };

  useEffect(() => {
    updateThemeMode(ThemeMode.DARK);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        primary,
        secondary,
        themeMode,
        locale,
        navStyle,
        routes,
        layoutType,
        updateLayoutStyle,
        rtAnim,
        rtlLocale: defaultConfig.rtlLocale,
        isRTL,
        sidebarColor,
        setRTL,
        updateSidebarColor,
        footer,
        footerType,
        setFooter,
        setFooterType,
        themeStyle,
        updateThemeStyle,
        updateTheme,
        updateMode,
        updateThemeMode,
        updatePrimaryColor,
        updateSecondaryColor,
        changeLocale,
        changeNavStyle,
        changeRTAnim,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
