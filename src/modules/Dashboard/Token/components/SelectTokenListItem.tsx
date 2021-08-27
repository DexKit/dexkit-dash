import {
  Box,
  makeStyles,
  Chip,
  useTheme,
  Grid,
  Typography,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';
import {Token} from 'types/app';

export interface Props {
  token: Token;
  onClick: (token: Token) => void;
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

export const SelectTokenListItem = (props: Props) => {
  const {token, onClick, style} = props;
  const theme = useTheme();
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(token);
  }, [token, onClick]);

  return (
    <Box
      onClick={handleClick}
      style={{...style, padding: theme.spacing(2)}}
      className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={2}>
        <Grid item>
          <Box className={classes.tokenContainer}>
            <img src={token.logoURI} className={classes.token} />
          </Box>
        </Grid>
     
        <Grid item xs>
          <Typography variant='body1'>{token.symbol?.toUpperCase()}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {token.name}
          </Typography>
        </Grid>
        <Grid item>
          {token?.networkName ? (
            <Chip
              size='small'
              label={FORMAT_NETWORK_NAME(token?.networkName)}
            />
          ) : null}
        </Grid>
       
      </Grid>
    </Box>
  );
};

export default SelectTokenListItem;
