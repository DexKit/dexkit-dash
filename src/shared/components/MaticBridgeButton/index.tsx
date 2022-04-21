import React, {useCallback} from 'react';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {Box, Typography, makeStyles} from '@material-ui/core';
import {useMaticBridge} from 'hooks/useMaticBridge';
import {ReactComponent as ProgrammingArrowsIcon} from 'assets/images/icons/programming-arrows-white.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
  itemText: {
    whiteSpace: 'nowrap',
  },
}));
type Props = {
  btnMsg?: string;
  defaultCurrency?: string;
};

const MaticBridgeButton = (props: Props) => {
  const classes = useStyles();
  const {initBridge} = useMaticBridge();

  const handleBuyCrypto = useCallback(() => {
    initBridge();
  }, [initBridge]);

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Box mb={1}>
        <RoundedIconButton onClick={handleBuyCrypto}>
          <ProgrammingArrowsIcon className={classes.icon} />
        </RoundedIconButton>
      </Box>
      <Typography variant='caption' className={classes.itemText}>
        Bridge
      </Typography>
    </Box>
  );
};

export default MaticBridgeButton;
