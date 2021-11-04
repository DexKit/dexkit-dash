import {Tabs, Tab, withStyles} from '@material-ui/core';

export const CustomTabs = withStyles((theme) => ({
  root: {
    backgroundColor: '#2F3142',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}))(Tabs);

export const CustomTab = withStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: '#525C75',
    },
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
  },
  selected: {
    color: theme.palette.common.white,
    backgroundColor: '#525C75',
  },
  textColorPrimary: {
    color: theme.palette.common.white,
  },
}))(Tab);
