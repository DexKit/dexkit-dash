import React, {useContext, useEffect} from 'react';
import MomentUtils from '@date-io/moment';
// import moment from 'moment';
import {ThemeProvider} from '@material-ui/styles';
import {createTheme} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import AppContext from '../AppContext';
import {useBreakPointDown} from '../Utils';
import {NavStyle, ThemeMode, ThemeStyle} from 'shared/constants/AppEnums';
import {useUrlSearchParams} from 'use-url-search-params';
import AppContextPropsType from '../../../types/AppContextPropsType';

const theme = createTheme({
  spacing: 4,
  props: {
    MuiIconButton: {
      color: 'inherit',
    },
    MuiIcon: {
      color: 'inherit',
    },
  },
  typography: {
    fontFamily: ['Sora', 'sans-serif'].join(','),
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#F0883E',
    },
    success: {
      main: '#2EA043',
    },
    error: {
      main: '#F85149',
    },
    warning: {
      main: '#BB800A',
    },
    info: {
      main: '#388BFD',
    },
    text: {
      primary: '#fff',
    },
    background: {
      default: '#0D1017',
      paper: '#151B22',
    },
  },
  shape: {
    borderRadius: 4,
  },
});

const theme_light = createTheme({
  spacing: 4,
  props: {
    MuiIconButton: {
      color: 'inherit',
    },
    MuiIcon: {
      color: 'inherit',
    },
  },
  typography: {
    fontFamily: ['Sora', 'sans-serif'].join(','),
  },
  palette: {
    type: 'light',
    primary: {
      main: '#DB6D28',
    },
    success: {
      main: '#0E8424',
    },
    error: {
      main: '#CF332C',
    },
    warning: {
      main: '#BB800A',
    },
    info: {
      main: '#388BFD',
    },
    text: {
      primary: '#484F58',
    },
    background: {
      default: '#F7F7F9',
      paper: '#E4E7EB',
    },
  },
  shape: {
    borderRadius: 4,
  },
});

const CremaThemeProvider: React.FC<React.ReactNode> = (props) => {
  const {
    isRTL,
    updateThemeMode,
    changeNavStyle,
    updateThemeStyle,
    setRTL,
    updateTheme,
    themeMode,
  } = useContext<AppContextPropsType>(AppContext);
  const isBelowMd = useBreakPointDown('md');

  const initailValue: InitialType = {};
  const types: TypesType = {};
  const [params] = useUrlSearchParams(initailValue, types);

  console.log(themeMode);

  useEffect(() => {
    const updateQuerySetting = () => {
      if (params.theme_mode) {
        updateThemeMode!(params.theme_mode as ThemeMode);
      }
    };
    updateQuerySetting();
  }, [params.theme_mode, updateThemeMode]);

  useEffect(() => {
    const updateQuerySetting = () => {
      if (params.is_rtl) {
        setRTL!(params.is_rtl as boolean);
      }
      if (params.is_rtl || isRTL) {
        document.body.setAttribute('dir', 'rtl');
      } else {
        document.body.setAttribute('dir', 'ltr');
      }
    };
    updateQuerySetting();
  }, [isRTL, params.is_rtl, setRTL]);

  useEffect(() => {
    const updateQuerySetting = () => {
      if (params.nav_style) {
        changeNavStyle!(params.nav_style as NavStyle);
      }
    };
    updateQuerySetting();
  }, [changeNavStyle, params.nav_style]);

  useEffect(() => {
    const updateQuerySetting = () => {
      if (params.theme_style) {
        if (params.theme_style === ThemeStyle.MODERN) {
          if (isBelowMd) {
            // @ts-ignore
            theme.overrides.MuiCard.root.borderRadius = 20;
            // @ts-ignore
            theme.overrides.MuiToggleButton.root.borderRadius = 20;
          } else {
            // @ts-ignore
            theme.overrides.MuiCard.root.borderRadius = 30;
            // @ts-ignore
            theme.overrides.MuiToggleButton.root.borderRadius = 30;
          }
          // @ts-ignore
          theme.overrides.MuiButton.root.borderRadius = 30;
          // @ts-ignore
          theme.overrides.MuiCardLg.root.borderRadius = 50;
        } else {
          // @ts-ignore
          theme.overrides.MuiCard.root.borderRadius = 4;
          // @ts-ignore
          theme.overrides.MuiToggleButton.root.borderRadius = 4;
          // @ts-ignore
          theme.overrides.MuiButton.root.borderRadius = 4;
          // @ts-ignore
          theme.overrides.MuiCardLg.root.borderRadius = 4;
        }
        updateTheme!(theme);
        if (
          params.theme_style === ThemeStyle.MODERN ||
          params.theme_style === ThemeStyle.STANDARD
        ) {
          updateThemeStyle!(params.theme_style as ThemeStyle);
        }
      }
    };
    updateQuerySetting();
    // eslint-disable-next-line
  }, [params.theme_style, theme, isBelowMd, updateTheme, updateThemeStyle]);

  return (
    <ThemeProvider theme={themeMode === ThemeMode.LIGHT ? theme_light : theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {props.children}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default React.memo(CremaThemeProvider);
