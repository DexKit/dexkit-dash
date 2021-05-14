import React, {useEffect, useContext} from 'react';
import IconButton from '@material-ui/core/IconButton';

import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import {makeStyles} from '@material-ui/core';

import clsx from 'clsx';

import AppContextPropsType, {
  CremaTheme,
} from '../../../types/AppContextPropsType';

import {AppContext} from '@crema';
import {ThemeMode} from 'shared/constants/AppEnums';

const ThemeModeSwitcher = () => {
  const {
    themeMode,
    theme,
    updateThemeMode,
  } = useContext<AppContextPropsType>(AppContext);

  const onClickThemeButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
        const changedTheme = theme.palette.type === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
        updateThemeMode!(changedTheme);
  };

  const isLight = theme.palette.type === ThemeMode.DARK;

  const useStyles = makeStyles((theme: CremaTheme) => ({
    notiBtn: {
      justifyContent: 'flex-start',
      width: '100%',
      height: 56,
      fontSize: 16,
      borderRadius: 0,
      paddingLeft: '1rem',
      paddingRight: '1rem',
      color: theme.palette.grey[800],
      '&:hover, &:focus': {
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
      },
      [theme.breakpoints.up('sm')]: {
        height: 70,
      },
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        width: 'auto',
        borderLeft: 'solid 1px',
        borderLeftColor: theme.palette.grey[200],
        color: theme.palette.grey[400],
        '&:hover, &:focus': {
          color: theme.palette.text.primary,
          // backgroundColor: theme.palette.btn.hover,
        },
      },
      [theme.breakpoints.up('lg')]: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      },
      [theme.breakpoints.up('xl')]: {
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
      },
    },
    notiIcon: {
      fontSize: 22,
      color: theme.palette.grey[400],
      [theme.breakpoints.up('xl')]: {
        fontSize: 30,
      },
    },
  }));

  const classes = useStyles();

  return (
    <>
      <IconButton
        className={clsx(classes.notiBtn, 'notiBtn')}
        aria-label={isLight ? 'Dark Theme' : 'Light Theme'}
        color='inherit'
        onClick={onClickThemeButton}>
        {!isLight && (
          <Brightness7Icon className={clsx(classes.notiIcon, 'notiIcon')} />
        )}
        {isLight && (
          <Brightness2Icon className={clsx(classes.notiIcon, 'notiIcon')} />
        )}
      </IconButton>
    </>
  );
};

export default ThemeModeSwitcher;
