import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  zeroPadding: {
    padding: 0,
  },
  btnPrimary: {
    '&:hover > div, &:focus > div': {
      // backgroundColor: `${theme.palette.primary.dark} !important`,
      color: 'white',
    },
  },
  btnSecondary: {
    '&:hover > div, &:focus > div': {
      // backgroundColor: `${theme.palette.secondary.dark} !important`,
      color: 'white',
    },
  },
  root: {
    flexGrow: 1,
  },
}));
