import {
    Box,
    makeStyles,
    Chip,
    useTheme,
    Grid,
    Typography,
  } from '@material-ui/core';
  import React, {useCallback} from 'react';
  import { CoinFeed } from 'modules/CoinsLeague/utils/types';
  
  export interface Props {
    coin: CoinFeed;
    onClick: (coin: CoinFeed) => void;
    style: React.CSSProperties;
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
  }));
  
  export const SelectCoinListItem = (props: Props) => {
    const {coin, onClick, style} = props;
    const theme = useTheme();
    const classes = useStyles();
  
    const handleClick = useCallback(() => {
      onClick(coin);
    }, [coin, onClick]);
  
    return (
      <Box
        onClick={handleClick}
        style={{...style, padding: theme.spacing(2)}}
        className={classes.item}>
        <Grid alignItems='center' alignContent='center' container spacing={2}>
          <Grid item>
            <Box className={classes.tokenContainer}>
              <img src={coin.logo} className={classes.token} />
            </Box>
          </Grid>
       
          <Grid item xs>
            <Typography variant='body1'>{`${coin.base.toUpperCase()} / ${coin.quote.toUpperCase()}`}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {coin.baseName}
            </Typography>
          </Grid>
          <Grid item>
          </Grid>
         
        </Grid>
      </Box>
    );
  };
  
  export default SelectCoinListItem;
  