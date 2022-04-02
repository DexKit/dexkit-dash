import {makeStyles} from '@material-ui/core';
import {CremaTheme} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => {
  return {
    appMain: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      backgroundColor: theme.palette.background.default,
    },
    mainContent: {
      display: 'flex',
      transition: 'all 0.5s ease',
    },
    mainContainer: {
      width: '100%',
    },
    mainContainerFull: {
      width: '100vw',
    },
    boxedLayout: {
      [theme.breakpoints.up('lg')]: {
        maxWidth: 1260,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.12)',
      },
      [theme.breakpoints.up('xl')]: {},
    },
    accountsDialgContent: {
      padding: theme.spacing(4),
    },
    accountsFixedHeight: {
      minHeight: '80vh',
    },
  };
});
export default useStyles;
