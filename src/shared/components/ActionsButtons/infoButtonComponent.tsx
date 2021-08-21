import React, {PropsWithChildren, useState} from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import {
  Grow,
  IconButton,
  makeStyles,
  Popover,
  PopoverProps,
  Typography,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import {ExcludedTypes} from 'types';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    textAlign: 'center',
    fontWeight: theme.typography.body1.fontWeight,
    color: theme.typography.body1.color,
  },
  button: {
    color: theme.palette.grey[500],
  },
}));

interface InternalPopOverProps {
  open: boolean;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  disablePortal?: boolean;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
}

export type PopOverProps = ExcludedTypes<PopoverProps, InternalPopOverProps>;

export interface InfoButtonComponentProps {
  text?: string;
  show?: boolean;
  popoverProps?: PopOverProps;
  classes?: ClassNameMap<'paper' | 'text' | 'button'>;
}

type Props = PropsWithChildren<InfoButtonComponentProps>;

export function InfoButtonComponent(props: Props) {
  const {text, show, popoverProps, children, classes: customClass} = props;
  const [anchorEl, setAnchorEl] = useState(null);
  // const [placement] = useState<PopperPlacementType>(startPlacement ?? 'right-start')
  const [open, setOpen] = useState(Boolean(show));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = customClass ?? useStyles();

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  return (
    <>
      <IconButton
        className={classes.button}
        aria-label='add an alarm'
        onClick={handleClick}>
        <InfoOutlinedIcon />
      </IconButton>
      <Popover
        onClose={handleClose}
        disablePortal={false}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={(popoverProps as PopoverProps)?.anchorOrigin}
        transformOrigin={(popoverProps as PopoverProps)?.transformOrigin}
        anchorPosition={(popoverProps as PopoverProps)?.anchorPosition}
        {...popoverProps}>
        <Grow in={open} timeout={350}>
          <div className={classes.paper}>
            {text && <Typography className={classes.text}>{text}</Typography>}
            {children}
          </div>
        </Grow>
      </Popover>
    </>
  );
}
