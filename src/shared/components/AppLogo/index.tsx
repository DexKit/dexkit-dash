import 
React,
{ useContext } 
from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AppContext from '../../../@crema/utility/AppContext';
import {ThemeMode} from '../../constants/AppEnums';
import AppContextPropsType from '../../../types/AppContextPropsType';

export interface AppLogoProps {
  themeMode?:ThemeMode;
  justifyContent?: 'center' | 'left' | 'right' |  'start' | 'end';
  logo?: string;
  collapsed?: boolean;
}
const AppLogo: React.FC<AppLogoProps> = props => {
  // const {themeMode} = useContext<AppContextPropsType>(AppContext);
  const themeMode = props.themeMode ?? useContext<AppContextPropsType>(AppContext).themeMode;
  const logoSrc = props.logo ??
    (
      themeMode === ThemeMode.DARK
      ? require('assets/images/logo_white.svg')
      : require('assets/images/logo.svg')
    );
  const useStyles = makeStyles(() => ({
    logoRoot: {
      marginTop: '5px',
      marginLeft: '2px',
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: props.justifyContent
    },
    logo: {
      height: 28,
      marginRight: 10,
    },
  }));
  const classes = useStyles();
  return (
    <Box className={classes.logoRoot}>
      <img
        className={classes.logo}
        loading="lazy"
        src={ logoSrc }
        alt='crema-logo'
      />
      {props.collapsed ? 'DexKit' : ''}
    </Box>
  );
};

export default AppLogo;
