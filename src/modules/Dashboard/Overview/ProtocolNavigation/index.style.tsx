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
      transition: 'all 0.2s ease-in-out !important',
    },

    '&:hover > div, &:focus > div': {
      backgroundColor: `${theme.palette.primary.dark} !important`,
      color: 'white',
    },
  },
}));
