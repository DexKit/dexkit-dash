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
import Logo from 'shared/components/Logo';
import {getLogoSrcs} from 'utils';

type TokenBalance = Token & {
  value?: number | null;
  valueInUsd?: number | null;
};

export interface Props {
  token: TokenBalance;
  onClick: (token: TokenBalance) => void;
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

export const SelectTokenBalanceListItem = (props: Props) => {
  const {token, onClick, style} = props;
  const theme = useTheme();
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(token);
  }, [token, onClick]);

  // const addDefaultSrc = useCallback((ev: any) => {
  //   ev.target.src = noFoundSrc;
  // },[]);

  return (
    <Box
      onClick={handleClick}
      style={{...style, padding: theme.spacing(2)}}
      className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={2}>
        <Grid item>
          <Box className={classes.tokenContainer}>
            <Logo
              srcs={getLogoSrcs(
                token.address,
                token.networkName,
                token.logoURI,
              )}
              className={classes.token}
            />
          </Box>
        </Grid>

        <Grid item>
          <Typography variant='body1'>{token.symbol?.toUpperCase()}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {token.name}
          </Typography>
        </Grid>

        <Grid item xs>
          {token?.networkName ? (
            <Chip
              size='small'
              label={FORMAT_NETWORK_NAME(token?.networkName)}
            />
          ) : null}
        </Grid>

        <Grid item>{token?.value || 0}</Grid>
      </Grid>
    </Box>
  );
};

export default SelectTokenBalanceListItem;
