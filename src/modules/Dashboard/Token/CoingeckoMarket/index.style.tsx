import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {grey} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  appcard: {
    '& > div': {
      height: '100%',
    },
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > div': {
      flexBasis: '50%',
      minWidth: '120px',
      [theme.breakpoints.up('xl')]: {
        minWidth: '180px',
      },

      '& > div': {
        width: '120px',

        [theme.breakpoints.up('xl')]: {
          minWidth: '180px',
        },
      },
    },
  },
}));
