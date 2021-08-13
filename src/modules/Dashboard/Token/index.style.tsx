import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  iframeContainer: {
    display: 'flex',
    minHeight: 450,
    '& iframe': {
      minHeight: 450,
    },
  },
  btnPrimary: {
    fontFamily: Fonts.BOLD,

    '& > div': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },

    '&:hover > div, &:focus > div': {
      // backgroundColor: `${theme.palette.primary.dark} !important`,
      color: 'white',
    },
  },
  btnSecondary: {
    fontFamily: Fonts.BOLD,

    '& > div': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },

    '&:hover > div, &:focus > div': {
      // backgroundColor: `${theme.palette.secondary.dark} !important`,
      color: 'white',
    },
  },
  contractAddress: {
    fontSize: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: '3.8vw',
    },
  },
  title: {
    display: 'flex',
  },
  tabsContainer: {
    width: '350px'
  }
}));
