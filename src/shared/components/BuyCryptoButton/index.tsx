import React, {useCallback} from 'react';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {useTransak} from 'hooks/useTransak';
import {ReactComponent as AddCircleIcon} from 'assets/images/icons/add-circle.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  itemText: {
    whiteSpace: 'nowrap',
  },

}));

const BuyCryptoButton = () => {
  const classes = useStyles();
  const {init} = useTransak();

  const handleBuyCrypto = useCallback(() => {
    init();
  }, [init]);

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <RoundedIconButton onClick={handleBuyCrypto}>
        <AddCircleIcon className={classes.icon} />
      </RoundedIconButton>
      <Typography variant='caption' className={classes.itemText}>
        Buy Crypto
      </Typography>
    </Box>
  );
};

export default BuyCryptoButton;
