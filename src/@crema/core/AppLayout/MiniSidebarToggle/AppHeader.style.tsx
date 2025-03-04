import {fade, makeStyles} from '@material-ui/core/styles';
import {CremaTheme} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  appToolbar: {
    paddingLeft: 20,
    paddingRight: 20,
    minHeight: 56,
    [theme.breakpoints.up('sm')]: {
      minHeight: 70,
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 30,
      paddingRight: 30,
    },
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuIcon: {
    width: 35,
    height: 35,
  },
  menuIconCollapsed: {
    width: 35,
    height: 35,
    transform: 'rotate(180deg)',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.overrides.MuiCard.root.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  appBar: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '100%',
    transition: 'all 0.5s ease',
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100vw - 19rem)',
    },
    [theme.breakpoints.up('xl')]: {
      width: 'calc(100vw - 21rem)',
    },
  },
  menuItemRoot: {
    padding: 0,
  },
  pointer: {
    cursor: 'pointer',
  },
  logoRoot: {
    verticalAlign: 'middle',
    display: 'inline-block',
    height: 30,
  },
  menuIconRoot: {
    width: '2.5rem',
    height: '2.5rem',
  },
  badgeRoot: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  switchNetworkButton: {
    borderRadius: theme.shape.borderRadius,
  },
}));
export default useStyles;
