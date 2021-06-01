import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  toolbarIcon: {
    marginRight: '3px'
  }
}));
