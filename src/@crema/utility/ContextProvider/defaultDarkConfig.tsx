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
      type: ThemeMode.DARK,
      background: {
        paper: '#252836',
        default: '#1F1D2B',
        darker: '#252331',
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
    shape: {
      borderRadius: buttonBorderRadius,
    },
    overrides: {
      MuiTypography: {
        h1: {
          fontSize: 28,
          fontWeight: 500,
        },
        h2: {
          fontSize: 24,
          fontWeight: 500,
        },
        h3: {
          fontSize: 18,
          fontWeight: 500,
        },
        h4: {
          fontSize: 18,
          fontWeight: 400,
        },
        h5: {
          fontSize: 16,
          textTransform: 'uppercase',
          fontWeight: 'normal',
        },
        h6: {
          fontSize: 16,
        },
        subtitle1: {
          fontSize: 16,
          color: '#7D7E81',
        },
        subtitle2: {
          fontSize: 18,
          color: '#7D7E81',
        },
        body1: {
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '100%',
        },
        body2: {
          fontSize: 14,
          fontWeight: 500,
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
        rounded: {
          borderRadius: cardRadius,
        },
      },
      MuiAppBar: {
        root: {
          borderRadius: 0,
        },
      },
      MuiOutlinedInput: {
        root: {
          borderRadius: inputBorderRadius,
          backgroundColor: 'rgba(82, 92, 117, 0.5)',
        },
      },
      MuiButton: {
        root: {
          borderRadius: buttonBorderRadius,
          [breakpoints.down('md')]: {
            paddingTop: '8px !important',
            paddingBottom: '8px !important',
          },
        },
        contained: {
          backgroundColor: '#383D50',
          color: '#FFF',
          border: '1px solid #525C75',
        },
        containedPrimary: {
          backgroundColor: '#FFA552',
          color: '#2A2C31',
          '&:hover': {
            boxShadow: '0px 7px 13px 1px rgba(255, 165, 82, 0.34)',
          },
        },
        outlined: {
          borderRadius: inputBorderRadius,
          backgroundColor: 'rgba(82, 92, 117, 0.5)',
        },
        disabled: {
          borderColor: '#646672',
          borderWidth: '1px',
          color: '#646672',
          backgroundColor: '#3A3D4A',
        },
      },
      MuiAccordion: {
        root: {
          padding: 8,
          borderRadius: cardRadius,
          '&:before': {
            display: 'none',
          },
        },
        rounded: {
          borderRadius: cardRadius,
        },
        expanded: {
          margin: 0,
        },
      },
      MuiAccordionSummary: {
        root: {
          textTransform: 'uppercase',
          fontSize: 18,
          fontWeight: 500,
        },
      },
      MuiTablePagination: {
        select: {
          backgroundColor: '#3C4255',
          borderRadius: inputBorderRadius,
          border: '1px solid #525C75',
          padding: 16,
          fontWeight: 500,
          fontStyle: 'normal',
          fontSize: 18,
          color: '#fff',
        },
      },
      MuiStepper: {
        root: {
          borderRadius: cardRadius,
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
