import React, {useState, useCallback} from 'react';
import {Box, Grid, Backdrop, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {CremaTheme} from 'types/AppContextPropsType';

import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

const SwapComponent = React.lazy(() => import('modules/Dashboard/Swap/Swap'));

const useStyles = makeStyles((theme: CremaTheme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal,
    color: '#fff',
  },
  item: {
    marginRight: theme.spacing(4),
    objectFit: 'contain',
  },
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

const SwapButton = () => {
  const classes = useStyles();

  const [showSwap, setShowSwap] = useState(false);

  const onSwap = useCallback(() => {
    setShowSwap(true);
  }, []);

  const handleSwapClose = useCallback(() => {
    setShowSwap(false);
  }, []);

  return (
    <>
      <Backdrop className={classes.backdrop} open={showSwap}>
        <Grid container alignItems='center' justify='center'>
          <Grid item xs={12} sm={4}>
            {showSwap ? <SwapComponent onClose={handleSwapClose} /> : null}
          </Grid>
        </Grid>
      </Backdrop>

      <Box display='flex' flexDirection='column' alignItems='center'>
        <Box mb={1}>
          <RoundedIconButton onClick={onSwap}>
            <MoneySendIcon className={classes.icon} />
          </RoundedIconButton>
        </Box>
        <Typography variant='caption' className={classes.itemText}>
          Swap
        </Typography>
      </Box>
    </>
  );
};

export default SwapButton;
