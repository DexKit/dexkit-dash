import {Tabs, Tab, withStyles} from '@material-ui/core';

export const CustomTabs = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}))(Tabs);

export const CustomTab = withStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    textTransform: 'capitalize',
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
  },
  selected: {
    color: theme.palette.text.primary,
    background: theme.palette.action.hover,
  },
  textColorPrimary: {
    color: theme.palette.text.primary,
  },
}))(Tab);
