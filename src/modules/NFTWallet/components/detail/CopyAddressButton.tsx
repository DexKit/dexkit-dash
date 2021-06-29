import React, {useState, useCallback} from 'react';
import {Button, Tooltip} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

interface Props {
  copyText: string;
}

export default (props: Props) => {
  const {copyText} = props;

  const [open, setOpen] = useState(false);

  const handleTooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleTooltipOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }, []);

  const handleCopyAddress = useCallback(() => {
    handleTooltipOpen();
    navigator.clipboard.writeText(copyText);
    document.execCommand('copy');
  }, [copyText]);

  return (
    <Tooltip
      open={open}
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      title='Copied to clipboard'>
      <Button
        size='small'
        startIcon={<FileCopyIcon />}
        color='primary'
        variant='outlined'
        onClick={handleCopyAddress}>
        Copy URL
      </Button>
    </Tooltip>
  );
};
