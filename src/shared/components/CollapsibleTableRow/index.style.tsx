import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    backgroundColor: 'transparent',
    borderBottom: '0 none',
    fontSize: 16,
    flexGrow: 1,
    flexBasis: '50%',
    margin: '8px',
  },
  tableTitle: {
    color: theme.palette.text.secondary,
  },
  openedAccordion: {
    backgroundColor: '#252331',
  },
  accordionContainer: {
    padding: '0 8px',
    borderBottom: '1px solid #8F96A733',
    '&.MuiPaper-rounded': {
      borderRadius: '0',
    },
  },
  accordionSummary: {
    '& .MuiAccordionSummary-content': {
      width: '100%',
      margin: '0px',
      textTransform: 'none',
      fontSize: '16px',
      '& > .MuiBox-root': {
        flexGrow: 1,
        flexBasis: '50%',
      },
    },
    '&.Mui-expanded': {
      minHeight: '50px',
    },
  },
  rowContainer: {
    display: 'flex',
  },
  accordionDetails: {},
}));

export default useStyles;
