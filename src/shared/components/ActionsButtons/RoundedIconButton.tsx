import {withStyles, IconButton} from '@material-ui/core';

export const RoundedIconButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#2E3243',
    border: '1px solid #525C75',
  },
}))(IconButton);

export default RoundedIconButton;
