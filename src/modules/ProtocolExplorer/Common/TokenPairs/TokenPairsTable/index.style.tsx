import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableResponsiveMaterial: {
    minHeight: '.01%',
    overflowX: 'auto',
    overflowY: 'hidden',
    '@media (max-width: 767px)': {
      borderTop: `1px solid ${theme.palette.divider}`,
      width: '100%',
      marginBottom: 15,
      '& > table': {
        marginBottom: 0,
        '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td':
          {
            whiteSpace: 'nowrap',
          },
      },
    },
  },
}));
