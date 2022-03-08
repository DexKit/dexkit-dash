import React from 'react';

import {
  ButtonBase,
  ButtonBaseProps,
  Typography,
  withStyles,
  Avatar,
  Box,
  makeStyles,
  Button,
  ButtonProps,
} from '@material-ui/core';
import {truncateAddress} from 'utils';

const CustomButtom = withStyles((theme) => ({
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'block',
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: '50%',
  },
}));

interface Props extends ButtonProps {
  account: {label?: string; address: string};
}

export function AccountSelect(props: Props) {
  const {account} = props;

  const classes = useStyles();

  return (
    <CustomButtom variant='outlined' fullWidth {...props}>
      <Box display='flex' alignItems='center' alignContent='center'>
        <Box mr={2}>
          <Avatar className={classes.icon} />
        </Box>
        <Box display='flex' flexDirection='column' justifyContent='flex-start'>
          <Typography variant='body1'>
            {account.address !== account.label
              ? account.label
              : truncateAddress(account.address)}
          </Typography>
          {account.address !== account.label ? (
            <Typography variant='body2' color='textSecondary'>
              {truncateAddress(account.address)}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </CustomButtom>
  );
}
