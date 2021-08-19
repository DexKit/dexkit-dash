import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {grey} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  row: {
    display: 'flex',
  },
}));
