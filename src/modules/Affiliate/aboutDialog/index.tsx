import React from 'react';

import {useIntl} from 'react-intl';

import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import {Link, Tooltip} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles(() => ({
  openButton: {
    marginLeft: '10px',
  },
}));

export const AboutDialog = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const {messages} = useIntl();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant='outlined'
        onClick={handleClickOpen}
        className={classes.openButton}>
        <Tooltip title={messages['app.infoPage'] as string}>
          <InfoIcon />
        </Tooltip>
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          {messages['affiliate.dialog.about.title']}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {messages['affiliate.dialog.about.p1']}
          </Typography>
          <Typography gutterBottom>
            {messages['affiliate.dialog.about.p2']}
          </Typography>
          <Typography gutterBottom>
            {messages['affiliate.dialog.about.p3']}
          </Typography>
          <Typography gutterBottom>
            {messages['app.example']}:{' '}
            <Link
              href={
                'https://swap.dexkit.com/#/swap?account=0xyouraccount&inputCurrency=0x9F9913853f749b3fE6D6D4e16a1Cc3C1656B6D51'
              }
              target={'_blank'}>
              https://swap.dexkit.com/#/swap?account=0xyouraccount&inputCurrency=0x9F9913853f749b3fE6D6D4e16a1Cc3C1656B6D51{' '}
            </Link>
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
