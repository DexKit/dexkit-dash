import React, {useCallback} from 'react';

import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  withStyles,
  makeStyles,
  Chip,
} from '@material-ui/core';
import {Token} from 'types/app';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_CHAIN_ID_NAME,
} from 'shared/constants/Blockchain';
import Close from '@material-ui/icons/Close';

const CustomButtom = withStyles((theme) => ({
  root: {
    textTransform: 'uppercase',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(82, 92, 117, 0.5)',
    border: '1px solid #525C75',
  },
}))(ButtonBase);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: '50%',
  },
  name: {
    fontSize: theme.spacing(4),
  },
  symbol: {
    color: theme.palette.text.secondary,
    fontSize: theme.spacing(3),
  },
}));

interface SelectTokenButtonProps extends ButtonBaseProps {
  token?: Token;
  onClear: () => void;
  onClick: () => void;
}

export const SelectTokenButton = (props: SelectTokenButtonProps) => {
  const {token, onClear, onClick} = props;

  const classes = useStyles();

  const handleClick = useCallback(() => {
    if (token) {
      onClear();
    } else {
      onClick();
    }
  }, [token, onClick, onClear]);

  return (
    <CustomButtom onClick={handleClick}>
      {token ? (
        <>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box mr={2}>
              <img className={classes.icon} src={token?.logoURI} />
            </Box>
            <Box display='flex' alignItems='flex-start' flexDirection='column'>
              <Box className={classes.name}>{token?.name}</Box>
              <Box className={classes.symbol}>{token?.symbol}</Box>
            </Box>
          </Box>
          {token?.networkName ? (
            <Box display='flex'>
              <Box>
                <Chip
                  size='small'
                  label={GET_CHAIN_ID_NAME(
                    GET_CHAIN_FROM_NETWORK(token?.networkName),
                  )}
                />
              </Box>
              {token ? (
                <Box ml={2}>
                  <Close />
                </Box>
              ) : null}
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
