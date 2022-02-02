import {makeStyles} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';

export const marketFormStyles = makeStyles((theme) => ({
  marketContainer: {
    '& .MuiOutlinedInput-input': {
      padding: '14px',
    },
  },
  maxBalance: {
    '&:hover, &:focus': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  root: {
    color: theme.palette.secondary.main,
    fontSize: 18,
    marginTop: 6,
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
      marginTop: 16,
    },
  },
  boxContainer: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(9),

    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
    },
  },
  textRes: {
    marginBottom: 0,
    fontSize: 13,
    cursor: 'pointer',

    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    '&:hover, &:focus': {
      cursor: 'pointer',
    },
  },
  amountTotal: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  inputText: {
    fontFamily: Fonts.MEDIUM,
    width: '100%',
  },
  toText: {
    '&:disabled': {
      color: 'text.primary',
    },
  },
  inputLabel: {
    paddingBottom: '0px !important',
    fontWeight: 'bold',
  },
  submit: {
    marginTop: '20px',
  },
}));

export const limitFormStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    fontSize: 18,
    marginTop: 6,
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
      marginTop: 16,
    },
  },
  boxContainer: {
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
    },
  },
  btnPrimary: {
    backgroundColor: theme.palette.primary.main,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  textRes: {
    marginBottom: 0,
    fontSize: 13,
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    '&:hover, &:focus': {
      cursor: 'pointer',
    },
  },
  amountTotal: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  inputText: {
    fontFamily: Fonts.MEDIUM,
    width: '100%',
  },
  inputLabel: {
    paddingBottom: '4px !important',
    fontWeight: 'bold',
  },
  balance: {
    paddingBottom: '4px !important',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  swap: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  limitContainer: {
    padding: '8px',
    '& .MuiOutlinedInput-input': {
      padding: '14px',
    },
    '& .MuiGrid-container > .MuiGrid-item': {
      padding: '6px 8px',
    },
  },
  expiryContainer: {
    display: 'flex',
    marginBottom: '16px',
    '.MuiInputBase-root': {
      margin: '0 8px',
    },
  },
  select: {
    width: '100%',
    marginRight: '16px',
  },
  submit: {
    marginTop: '20px',
  },
  inputPriceAddornment: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));
