import React, {useCallback} from 'react';
import {
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@material-ui/core';


interface Props extends IconButtonProps {
  copyText: string;
  tooltip: string;
  children: React.ReactNode | React.ReactNode[];
}

export const CopyButton = (props: Props) => {
  const {copyText, tooltip, children} = props;

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

  const handleCopy = useCallback(() => {
    handleTooltipOpen();
    navigator.clipboard.writeText(copyText);
    document.execCommand('copy');
  }, [copyText]);

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      disableTouchListener
      title={tooltip}>
      <IconButton onClick={handleCopy} {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
