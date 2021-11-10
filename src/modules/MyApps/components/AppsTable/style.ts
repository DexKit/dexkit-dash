import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {grey} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  tableResponsiveMaterial: {
    // minHeight: '.01%',
    overflowX: 'auto',

    '@media (max-width: 767px)': {
      width: '100%',
      marginBottom: 15,
      overflowY: 'hidden',
      borderTop: `1px solid ${grey[300]}`,
      '& > table': {
        marginBottom: 0,
        '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td':
          {
            whiteSpace: 'nowrap',
          },
      },
    },
  },
  tableCell: {
    fontSize: 16,
    // padding: '12px 8px',
    padding: '8px',
    '&:first-child': {
      //   [theme.breakpoints.up('xl')]: {
      //     paddingLeft: 4,
      //   },
      paddingLeft: 20,
    },
    '&:last-child': {
      //   [theme.breakpoints.up('xl')]: {
      //     paddingRight: 4,
      //   },
      paddingRight: 20,
    },
    // [theme.breakpoints.up('xl')]: {
    //   fontSize: 18,
    //   padding: 16,
    // },
  },
  anchar: {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
  },
  badgeRoot: {
    padding: '3px 10px',
    borderRadius: 4,
    display: 'inline-block',
  },
  tableRowRoot: {
    color: grey[500],
  },
  tableCellRoot: {
    borderBottom: '0 none',
    fontSize: 16,
    padding: 8,
    fontFamily: Fonts.LIGHT,
    backgroundColor: theme.palette.background.paper,
    '&:first-child': {
      //   [theme.breakpoints.up('xl')]: {
      //     paddingLeft: 4,
      //   },
      paddingLeft: 20,
    },
    '&:last-child': {
      //   [theme.breakpoints.up('xl')]: {
      //     paddingRight: 4,
      //   },
      paddingRight: 20,
    },
    // [theme.breakpoints.up('xl')]: {
    //   fontSize: 18,
    //   padding: 16,
    // },
  },
  fabButtonDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  paginationDesktop: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  paginationMobile: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  notHaveAppsMsg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0px',
  },
}));

export default useStyles;
