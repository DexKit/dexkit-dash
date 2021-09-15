import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';

export const useStyles = makeStyles((theme: CremaTheme) => ({
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
  mobileContainer: {
    margin: '0 0px',
  },
  mobileChartsContainer: {
    padding: 0,
    paddingBottom: '12px',
    margin: '12px 0',
    borderBottom: `1px solid ${theme.palette.secondary.dark}`,
  },

  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));
