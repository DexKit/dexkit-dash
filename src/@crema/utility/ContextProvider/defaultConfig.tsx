import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import {
  Fonts,
  FooterType,
  LayoutType,
  NavStyle,
  RouteTransition,
  ThemeMode,
  ThemeStyle,
} from '../../../shared/constants/AppEnums';

const breakpoints = createBreakpoints({});
const cardRadius = 12;
const inputBorderRadius = 8;
const buttonBorderRadius = 8;

const defaultConfig: any = {
  theme: {
    spacing: 4,
    direction: 'ltr', //ltr, rtl
    palette: {
      type: ThemeMode.LIGHT,
      background: {
        paper: '#FFFFFF',
        default: '#f3f4f6',
      },
      primary: {
        main: '#FFA552',
        contrastText: '#fff',
      },
      secondary: {
        main: '#FCEFE4',
      },
      sidebar: {
        bgColor: '#2E3243',
        textColor: '#fff',
      },
      common: {
        white: '#fff',
        black: '#fff',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: '#8F96A7',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
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
          fontSize: 28,
        },
        h2: {
          fontSize: 24,
        },
        h3: {
          fontSize: 18,
        },
        h4: {
          fontSize: 18,
        },
        h5: {
          fontSize: 16,
        },
        h6: {
          fontSize: 16,
        },
        subtitle1: {
          fontSize: 16,
        },
        subtitle2: {
          fontSize: 18,
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
          borderRadius: cardRadius,
        },
      },
      MuiCard: {
        root: {
          borderRadius: cardRadius,
          // boxShadow: '0px 5px 6px rgba(0, 0, 0, 0.04)',
        },
      },
      MuiPaper: {
        root: {
          borderRadius: cardRadius,
        },
      },
      MuiAppBar: {
        root: {
          borderRadius: 0,
        },
      },
      MuiButton: {
        root: {
          borderRadius: buttonBorderRadius,
          boxShadow: '0px 14px 22px rgba(255, 165, 82, 0.34)',
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
  navStyle: NavStyle.MINI_SIDEBAR_TOGGLE,
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
