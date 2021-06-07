import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

export const useStyles = makeStyles((theme: CremaTheme) => ({
  dialogTitle: {
    // width: '98vw',
    // maxWidth: '600px',
    // backgroundColor: theme.palette.primary.main,
    // color: 'white',
  },
  dialogContent: {
    overflow: 'hidden',
    // height: '98vh',
    // maxHeight: '330px',
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alighItem: 'center',
    margin: '0 20px 20px',
    padding: 20,
    backgroundColor: theme.palette.background.default,
    borderRadius: 5,
  },
  contentBox: {
    padding: 15,
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: 5,
  },
  dialogActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 20px 10px',
  },
  textPrimary: {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  textSecondary: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  valueSend: {
    marginBottom: 20,
    fontWeight: 600,
    // color: 'rgb(248, 78, 78)',
  },
  valueReceive: {
    fontWeight: 600,
    color: 'rgb(78, 228, 78)',
  },
  progressBar: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    padding: '20px 0 10px',
    gap: 5,
    marginLeft: '0 !important',
  },
}));
