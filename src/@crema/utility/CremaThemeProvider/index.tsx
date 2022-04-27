import React, {useContext, useEffect} from 'react';
import MomentUtils from '@date-io/moment';
import {ThemeProvider} from '@material-ui/styles';
import {createTheme} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import AppContext from '../AppContext';
import {ThemeMode} from 'shared/constants/AppEnums';
import AppContextPropsType from '../../../types/AppContextPropsType';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';

const darkTheme = createTheme({
  spacing: 4,
  props: {
    MuiIconButton: {
      color: 'inherit',
    },
    MuiIcon: {
      color: 'inherit',
    },
    MuiPaper: {
      variant: 'outlined',
    },
    MuiCard: {
      variant: 'outlined',
      elevation: 0,
    },
  },
  typography: {
    fontFamily: ['Sora', 'sans-serif'].join(','),
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#F0883E',
    },
    success: {
      main: '#2EA043',
    },
    error: {
      main: '#F85149',
    },
    warning: {
      main: '#BB800A',
    },
    info: {
      main: '#388BFD',
    },
    text: {
      primary: '#fff',
    },
    background: {
      default: '#0D1017',
      paper: '#151B22',
    },
  },
  shape: {
    borderRadius: 4,
  },
});

const lightTheme = createTheme({
  spacing: 4,
  props: {
    MuiIconButton: {
      color: 'inherit',
    },
    MuiIcon: {
      color: 'inherit',
    },
    MuiPaper: {
      variant: 'outlined',
    },
    MuiCard: {
      variant: 'outlined',
      elevation: 0,
    },
  },
  typography: {
    fontFamily: ['Sora', 'sans-serif'].join(','),
  },
  palette: {
    type: 'light',
    primary: {
      main: '#ffa552',
    },
    success: {
      main: '#0E8424',
    },
    error: {
      main: '#CF332C',
    },
    warning: {
      main: '#BB800A',
    },
    info: {
      main: '#388BFD',
    },
    text: {
      primary: '#484F58',
    },
    background: {
      default: '#FFF',
      paper: '#F7F7F9',
    },
  },
  shape: {
    borderRadius: 4,
  },
});

const CremaThemeProvider: React.FC<React.ReactNode> = (props) => {
  const {updateThemeMode} = useContext<AppContextPropsType>(AppContext);

  const {darkMode} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  useEffect(() => {
    if (darkMode) {
      updateThemeMode!(ThemeMode.DARK);
    } else {
      updateThemeMode!(ThemeMode.LIGHT);
    }
  }, [darkMode, updateThemeMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {props.children}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default React.memo(CremaThemeProvider);
