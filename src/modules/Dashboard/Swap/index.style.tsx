import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  btnPrimary: {
    fontFamily: Fonts.BOLD,

  },
  btnSecondary: {
    fontFamily: Fonts.BOLD,

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
}));
