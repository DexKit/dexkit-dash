import React, {useCallback, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import {UIAccount} from 'redux/_ui/reducers';
import {truncateAddress} from 'utils';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles, Theme, useTheme} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DoneIcon from '@material-ui/icons/Done';
import {ReactComponent as EditIcon} from 'assets/images/icons/edit.svg';
import clsx from 'clsx';
import {Home} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  paperDefault: {
    borderWidth: 1,
    borderColor: '#525C75',
    borderStyle: 'solid',
  },
}));

interface AccountListItemProps {
  account: UIAccount;
  isConnected: boolean;
  isDefault: boolean;
  selectActive: boolean;
  selected: boolean;
  onSelect: (account: UIAccount) => void;
  onLabelChange: (account: UIAccount, newLabel: string) => void;
  onOpenMenu: (target: HTMLButtonElement, account: UIAccount) => void;
  onMakeDefault: (account: UIAccount) => void;
}

export const AccountListItem = (props: AccountListItemProps) => {
  const {
    account,
    isConnected,
    isDefault,
    selectActive,
    onSelect,
    onLabelChange,
    onMakeDefault,
    selected,
  } = props;

  const [label, setLabel] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const theme = useTheme();

  const classes = useStyles();

  const {messages} = useIntl();

  const isDesktop = useMediaQuery<Theme>((theme) =>
    theme?.breakpoints.up('sm'),
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value);
    },
    [],
  );

  /* eslint-disable */
  const handleDone = useCallback(
    (e: React.MouseEvent) => {
      onLabelChange(account, label);
      setLabel(account.label);
      setIsEditing(false);
    },
    [account, label],
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSelect = useCallback(() => {
    onSelect(account);
  }, [onSelect, account]);

  const handleMakeDefault = useCallback(() => {
    onMakeDefault(account);
  }, [onMakeDefault, account]);

  useEffect(() => {
    setLabel(account.label);
  }, [account]);

  return (
    <Paper
      className={clsx(
        classes.paper,
        isDefault ? classes.paperDefault : undefined,
      )}>
      {isEditing ? (
        <TextField
          fullWidth
          label={messages['app.dashboard.accountLabel'] as string}
          defaultValue={account.label || account.address}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Tooltip title={messages['app.dashboard.save'] as string}>
                  <IconButton onClick={handleDone} color='primary' size='small'>
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          onChange={handleLabelChange}
        />
      ) : (
        <Grid container alignItems='center' spacing={4}>
          <Grid item>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              {selectActive ? (
                <Checkbox
                  checked={selected}
                  color='primary'
                  onClick={handleSelect}
                />
              ) : (
                <Tooltip
                  title={
                    isConnected ? messages['app.dashboard.connected'] : ''
                  }>
                  <FiberManualRecordIcon
                    style={
                      isConnected
                        ? {color: theme.palette.success.main}
                        : undefined
                    }
                  />
                </Tooltip>
              )}
            </Box>
          </Grid>
          <Grid item xs>
            <Box display='flex' alignItems='center' alignContent='center'>
              <span style={{paddingRight: theme.spacing(2)}}>
                {!isDesktop && account.label == account.address
                  ? truncateAddress(account.label)
                  : account.label}
              </span>
            </Box>
            {account.address != account.label ? (
              <Typography variant='caption' color='textSecondary'>
                {isDesktop ? account.address : truncateAddress(account.address)}
              </Typography>
            ) : null}
          </Grid>
          {!selectActive ? (
            <Grid item>
              <IconButton onClick={handleEdit} size='small'>
                <EditIcon />
              </IconButton>
            </Grid>
          ) : null}
          {!isDefault && !selectActive ? (
            <Grid item>
              <IconButton onClick={handleMakeDefault} size='small'>
                <Home />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Paper>
  );
};

export default AccountListItem;
