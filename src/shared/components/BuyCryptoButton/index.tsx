import React, {useCallback} from 'react';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {useTransak} from 'hooks/useTransak';
import {ReactComponent as CardIcon} from 'assets/images/icons/card-white.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  itemText: {
    whiteSpace: 'nowrap',
  },

}));
type Props = {
    btnMsg?: string,
    defaultCurrency?: string,

 }


const BuyCryptoButton = (props: Props) => {
  const {btnMsg, defaultCurrency} = props;
  const classes = useStyles();
  const {init} = useTransak({defaultCurrency});

  const handleBuyCrypto = useCallback(() => {
    init();
  }, [init, defaultCurrency]);

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <RoundedIconButton onClick={handleBuyCrypto}>
        <CardIcon className={classes.icon} />
      </RoundedIconButton>
      <Typography variant='caption' className={classes.itemText}>
       {btnMsg || 'Buy Crypto'}
      </Typography>
    </Box>
  );
};

export default BuyCryptoButton;
