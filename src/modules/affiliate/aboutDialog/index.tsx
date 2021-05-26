import React from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { CremaTheme } from 'types/AppContextPropsType';
import {Link } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
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
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme: CremaTheme) => ({
    openButton: {
        marginLeft: '10px'
    }
  }));

export const AboutDialog = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles ();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} className={classes.openButton}>
          <InfoIcon/>
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          DexKit Affiliate Program
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            When you have 200 KIT, the fees collected by DexKit will go routed to your address when you use the affiliate link.
          </Typography>
          <Typography gutterBottom>
             Check last fees collected by your affiliate link and total collected rewards. DexKit assumes that all trades done by this address are only related to the affiliate fees, if you trade using this address it will count as well as collected fee.
          </Typography>
          <Typography gutterBottom>
             Additional fields are accepted, you can for instance append to your link the inputCurrency and outputCurrency to change the default tokens that show up.  
          </Typography>
          <Typography gutterBottom>
             Example: <Link href={'https://swap.dexkit.com/#/swap?account=0xyouraccount&inputCurrency=0x9F9913853f749b3fE6D6D4e16a1Cc3C1656B6D51'}  target={'_blank'}>https://swap.dexkit.com/#/swap?account=0xyouraccount&inputCurrency=0x9F9913853f749b3fE6D6D4e16a1Cc3C1656B6D51 </Link>  
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}