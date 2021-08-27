import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  avatar: {
    width: 50,
    height: 50,
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main,
  },
}));
