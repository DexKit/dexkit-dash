import React from 'react';

import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  withStyles,
  makeStyles,
  Chip,
  Typography,
} from '@material-ui/core';
import {Token} from 'types/app';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_CHAIN_ID_NAME,
} from 'shared/constants/Blockchain';

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
}));

interface SelectTokenButtonProps extends ButtonBaseProps {
  token?: Token;
  onClick: () => void;
}

export const SelectTokenButton = (props: SelectTokenButtonProps) => {
  const {token, onClick} = props;

  const classes = useStyles();

  return (
    <CustomButtom onClick={onClick}>
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
                  label={GET_CHAIN_ID_NAME(
                    GET_CHAIN_FROM_NETWORK(token?.networkName),
                  )}
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
