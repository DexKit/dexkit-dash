import IntlMessages from '@crema/utility/IntlMessages';
import {
  Button,
  Grid,
  Paper,
  Box,
  DialogProps,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import CustomDialogTitle from './CustomDialogTitle';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import {TreeView, TreeItem} from '@material-ui/lab';
import {truncateAddress} from 'utils';

import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

interface ObjectToTreeProps {
  nodes: any;
}

export const ObjectToTree: React.FC<ObjectToTreeProps> = ({nodes}) => {
  const classes = useStyles();

  const renderTree = (node: any) => {
    if (node === null) {
      return <TreeItem nodeId={String(node)} label={'null'} />;
    } else if (
      ['string', 'number', 'array', 'boolean', null].indexOf(typeof node) > -1
    ) {
      return (
        <TreeItem defaultChecked nodeId={String(node)} label={String(node)} />
      );
    }

    if (typeof node === 'object') {
      const keys = Object.keys(node);

      return keys.map((key, index: number) => (
        <TreeItem
          defaultChecked
          classes={{label: classes.item}}
          key={`${key}-${index}`}
          label={String(key)}
          nodeId={`${key}-${index}`}>
          {renderTree(node[key])}
        </TreeItem>
      ));
    }
  };

  return (
    <TreeView
      multiSelect
      defaultCollapseIcon={<ArrowDropUpIcon />}
      defaultExpandIcon={<ArrowDropDownIcon />}>
      {renderTree(nodes)}
    </TreeView>
  );
};

interface Props {
  dialogProps: DialogProps;
  signData?: any;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const SignDataDialog: React.FC<Props> = ({
  dialogProps,
  signData,
  onConfirm,
  onCancel,
}) => {
  const {onClose} = dialogProps;

  const {account} = useWeb3();

  const {messages} = useIntl();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        icon={<AssignmentTurnedInIcon />}
        title={messages['app.wallet.signMessage'] as string}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography gutterBottom align='center' variant='h5'>
              <IntlMessages id='app.wallet.signMessage' />
            </Typography>
            <Typography color='textSecondary' align='center'>
              {account && truncateAddress(account)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography align='center' gutterBottom variant='body1'>
                  <IntlMessages id='app.wallet.theMessageYouAreSigning' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {signData && signData.params && signData.params.length > 0 && (
                  <Paper variant='outlined'>
                    <Box p={2}>
                      <ObjectToTree
                        nodes={JSON.parse(signData.params[1]).message}
                      />
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onConfirm} variant='contained' color='primary'>
          <IntlMessages id='app.wallet.sign' />
        </Button>
        <Button onClick={onCancel}>
          <IntlMessages id='app.wallet.reject' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignDataDialog;
