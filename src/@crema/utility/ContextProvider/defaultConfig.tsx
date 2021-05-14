import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import {
  Fonts,
  FooterType,
  LayoutType,
  NavStyle,
  RouteTransition,
  ThemeMode,
  ThemeStyle,
  ThemeStyleRadius,
} from '../../../shared/constants/AppEnums';

const breakpoints = createBreakpoints({});
const cardRadius = ThemeStyleRadius.STANDARD;
const defaultConfig: any = {
  theme: {
    spacing: 4,
    direction: 'ltr', //ltr, rtl
    palette: {
      type: ThemeMode.DARK,
      background: {
        paper: '#181a1f',
        default: '#1d2125',
      //  default: '#fafbfc',
      },
      primary: {
        main: '#ff7149',
        contrastText: '#fff',
      },
      secondary: {
        main: '#420e00',
      },
      sidebar: {
        bgColor: '#181a1f',
        textColor: '#fff',
      },
      common: {
        white: '#fff',
        black: '#fff',
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.87)',
        secondary: 'rgba(255, 255, 255, 0.67)',
        disabled: 'rgba(255, 255, 255, 0.38)',
        hint: 'rgba(255, 255, 255, 0.38)',
      },
    },
    status: {
      danger: 'orange',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    typography: {
      fontFamily: [Fonts.REGULAR, 'sans-serif'].join(','),
    },
    overrides: {
      MuiTypography: {
        h1: {
          fontSize: 36,
        },
        h2: {
          fontSize: 30,
        },
        h3: {
          fontSize: 24,
        },
        h4: {
          fontSize: 22,
        },
        h5: {
          fontSize: 18,
        },
        h6: {
          fontSize: 16,
        },
        subtitle1: {
          fontSize: 18,
        },
        subtitle2: {
          fontSize: 20,
        },
        body1: {
          fontSize: 16,
        },
        body2: {
          fontSize: 14,
        },
      },
      MuiToggleButton: {
        root: {
          borderRadius: cardRadius,
        },
      },
      MuiCardLg: {
        root: {
          borderRadius:
            cardRadius === ThemeStyleRadius.STANDARD
              ? ThemeStyleRadius.STANDARD
              : ThemeStyleRadius.MODERN + 20,
        },
      },
      MuiCard: {
        root: {
          borderRadius: cardRadius,
          // boxShadow: '0px 5px 6px rgba(0, 0, 0, 0.04)',
        },
      },
      MuiButton: {
        root: {
          borderRadius: cardRadius,
          // boxShadow: '0px 5px 6px rgba(0, 0, 0, 0.04)',
          [breakpoints.down('md')]: {
            paddingTop: '8px !important',
            paddingBottom: '8px !important',
          },
        },
      },
    },
  },
  themeStyle: ThemeStyle.MODERN,
  themeMode: ThemeMode.SEMI_DARK,
  navStyle: NavStyle.MINI,
  layoutType: LayoutType.FULL_WIDTH,
  footerType: FooterType.FLUID,
  rtAnim: RouteTransition.NONE,
  footer: false,
  locale: {
    languageId: 'english',
    locale: 'en',
    name: 'English',
    icon: 'us',
  },
  rtlLocale: ['ar'],
};
export default defaultConfig;
