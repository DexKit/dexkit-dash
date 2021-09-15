import {makeStyles} from '@material-ui/core/styles';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  item: {
    marginRight: theme.spacing(4),
    objectFit: 'contain',
  },
}));
