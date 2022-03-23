import {
  Box,
  makeStyles,
  useTheme,
  Grid,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
  ButtonBase,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';

export interface Props {
  coin: CoinFeed;
  onClick: (coin: CoinFeed) => void;
  style: React.CSSProperties;
  selected?: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  tokenContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  token: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
  button: {
    display: 'block',
    width: '100%',
  },
}));

export const SelectCoinListItem = (props: Props) => {
  const {coin, onClick, style, selected, disabled} = props;
  const theme = useTheme();
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(coin);
  }, [coin, onClick]);

  return (
    <ButtonBase className={classes.button} disabled={disabled}>
      <Box onClick={handleClick} style={{...style, padding: theme.spacing(2)}}>
        <Grid container spacing={2} alignItems='center' alignContent='center'>
          <Grid item>
            <Box className={classes.tokenContainer}>
              <img alt='' src={coin.logo} className={classes.token} />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography align='left' variant='body1' color='inherit'>
              {coin.base.toUpperCase()} / {coin.quote.toUpperCase()}
            </Typography>
            <Typography align='left' variant='body2' color='textSecondary'>
              {coin.baseName}
            </Typography>
          </Grid>
          <Grid item>
            <Radio checked={selected} color='primary' />
          </Grid>
        </Grid>
      </Box>
    </ButtonBase>
  );
};

export default SelectCoinListItem;
