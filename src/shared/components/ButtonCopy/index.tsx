import React from 'react';
import {makeStyles, Tooltip} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {CremaTheme} from 'types/AppContextPropsType';

interface ButtonCopyProps {
  copyText: string;
  titleText: string;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  copyIcon: {
    marginLeft: '12px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

const ButtonCopy: React.FC<ButtonCopyProps> = (props) => {
  const classes = useStyles(props);

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      disableTouchListener
      title={props.titleText}>
      <FileCopyIcon
        className={classes.copyIcon}
        fontSize='small'
        color='primary'
        onClick={() => {
          handleTooltipOpen();
          navigator.clipboard.writeText(props.copyText);
          document.execCommand('copy');
        }}></FileCopyIcon>
    </Tooltip>
  );
};

export default ButtonCopy;
