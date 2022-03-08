import {makeStyles} from '@material-ui/core/styles';
import {useContext} from 'react';
import AppContext from '../../../utility/AppContext';
import {Fonts, ThemeMode} from '../../../../shared/constants/AppEnums';
import AppContextPropsType, {
  CremaTheme,
} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => {
  const {themeMode} = useContext<AppContextPropsType>(AppContext);
  return {
    item: {
      paddingLeft: 0,
    },
    itemIcon: {
      paddingRight: 16,
      paddingLeft: 16,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    svgActive: {
      '& > path': {
        fill: '#FFA552',
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
            themeMode === ThemeMode.LIGHT ? theme.palette.primary.main : '#fff',
        },

        '& .nav-item-icon': {
          color:
            themeMode === ThemeMode.LIGHT ? theme.palette.primary.main : '#fff',
        },

        '& .nav-item-icon-arrow': {
          color:
            themeMode === ThemeMode.LIGHT ? theme.palette.primary.main : '#fff',
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
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 18,
    },
    hiddenOverflow: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  };
});
export default useStyles;
