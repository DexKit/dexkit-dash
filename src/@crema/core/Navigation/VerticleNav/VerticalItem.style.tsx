import {alpha, makeStyles, lighten} from '@material-ui/core/styles';
import {useContext} from 'react';
import AppContext from '../../../utility/AppContext';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import AppContextPropsType from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme) => {
  const {themeMode} = useContext<AppContextPropsType>(AppContext);

  console.log(themeMode);
  console.log(theme.palette.primary.main);

  return {
    item: {},
    itemIcon: {
      background: lighten(theme.palette.background.paper, 0.1),
      width: theme.spacing(10),
      height: theme.spacing(10),
      padding: theme.spacing(2),
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    svgActive: {
      '& > path': {
        fill: theme.palette.primary.main,
      },
    },
    navItem: {
      height: 64,
      fontWeight: 700,
      cursor: 'pointer',
      textDecoration: 'none !important',
      paddingLeft:
        theme.direction === 'ltr'
          ? (props: {level: number}) => 24 + 50 * props.level
          : 12,
      paddingRight:
        theme.direction === 'rtl'
          ? (props: {level: number}) => 24 + 50 * props.level
          : 12,
      '&.nav-item-header': {
        textTransform: 'uppercase',
      },
      '&.active': {
        backgroundColor: 'rgba(82, 92, 117, 0.3)',
        pointerEvents: 'none',
        transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
        '& .nav-item-text': {
          color: theme.palette.primary.main + '!important',
          fontFamily: `${Fonts.LIGHT} !important`,
        },
        '& .nav-item-icon': {
          color: theme.palette.primary.main + '!important',
        },
      },

      '&:hover, &:focus': {
        '& .nav-item-text': {
          fontFamily: Fonts.MEDIUM,
          color:
            themeMode === ThemeMode.LIGHT ? theme.palette.text.primary : '#fff',
        },

        '& .nav-item-icon': {
          color:
            themeMode === ThemeMode.LIGHT ? theme.palette.text.primary : '#fff',
        },

        '& .nav-item-icon-arrow': {
          color:
            themeMode === ThemeMode.LIGHT ? theme.palette.text.primary : '#fff',
        },
      },
      '& .nav-item-icon': {
        color: theme.palette.text.primary,
      },
      '& .nav-item-text': {
        color: theme.palette.text.primary,
        fontSize: 18,
      },
    },
    '@media (max-width: 1919px)': {
      navItem: {
        height: 48,
        paddingLeft:
          theme.direction === 'ltr'
            ? (props: {level: number}) => 17 + 50 * props.level
            : 12,
        paddingRight:
          theme.direction === 'rtl'
            ? (props: {level: number}) => 17 + 50 * props.level
            : 12,

        '& .nav-item-text': {
          fontSize: 16,
        },
      },
    },
    listIcon: {
      fontSize: 18,
      [theme.breakpoints.up('xl')]: {
        fontSize: 20,
      },
    },
    listItemText: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 400,
      color: theme.palette.text.primary,
    },
    hiddenOverflow: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    divider: {
      backgroundColor: alpha(theme.palette.divider, 0.05),
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(4),
    },
  };
});
export default useStyles;
