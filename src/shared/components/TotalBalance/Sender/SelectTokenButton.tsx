import React from 'react';

import {
  Box,
  ButtonProps,
  withStyles,
  makeStyles,
  Chip,
  Typography,
  Button,
} from '@material-ui/core';
import {Token} from 'types/app';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_CHAIN_ID_NAME,
} from 'shared/constants/Blockchain';

const CustomButtom = withStyles((theme) => ({
  label: {
    textTransform: 'uppercase',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: '50%',
  },
}));

interface SelectTokenButtonProps extends ButtonProps {
  token?: Token;
  onClick: () => void;
}

export const SelectTokenButton = (props: SelectTokenButtonProps) => {
  const {token, onClick} = props;
  const classes = useStyles();

  return (
    <CustomButtom variant='outlined' fullWidth onClick={onClick}>
      {token ? (
        <>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box mr={2}>
              <img alt='' className={classes.icon} src={token?.logoURI} />
            </Box>
            <Box display='flex' alignItems='flex-start' flexDirection='column'>
              <Typography variant='body2' noWrap>
                {token?.name}
              </Typography>
              <Typography variant='caption' color='textSecondary'>
                {token?.symbol}
              </Typography>
            </Box>
          </Box>
          {token?.networkName ? (
            <Box display='flex'>
              <Box>
                <Chip
                  size='small'
                  label={
                    token?.isCustomNetwork
                      ? token.networkName
                      : GET_CHAIN_ID_NAME(
                          GET_CHAIN_FROM_NETWORK(token?.networkName),
                        )
                  }
                />
              </Box>
            </Box>
          ) : null}
        </>
      ) : (
        'Choose a token'
      )}
    </CustomButtom>
  );
};

export default SelectTokenButton;
