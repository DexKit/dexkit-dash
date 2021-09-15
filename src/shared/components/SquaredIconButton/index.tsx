import {IconButton, withStyles} from '@material-ui/core';

export const SquaredIconButton = withStyles((theme) => ({
  root: {
    color: '#7A8398',
    border: '1px #525C75 solid !important',
    borderRadius: 8,
    backgroundColor: '#252836',
  },
}))(IconButton);

export default SquaredIconButton;
