import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  dialogBox: {
    display: 'flex',
    justifyContent: 'center',
    alighItem: 'center',
    padding: '30px'
  }
}));
