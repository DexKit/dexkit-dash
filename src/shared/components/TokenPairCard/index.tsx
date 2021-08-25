import React from 'react';

import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  Radio,
  Box,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {},
  firstToken: {
    zIndex: TOKEN_ZINDEX + 1,
    position: 'relative',
  },
  secondToken: {
    zIndex: TOKEN_ZINDEX,
    left: theme.spacing(4),
  },
  tokenIcon: {
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}));

interface TokenPairIconProps {
  src: string;
}

export const TokenPairIcon = (props: TokenPairIconProps) => {
  const {src} = props;

  const classes = useStyles();

  return <img className={classes.tokenIcon} src={src} />;
};

const TOKEN_ZINDEX = 1;

interface TokenPairCardProps {
  firstToken: string;
  secondToken: string;
  firstIcon: React.ReactNode;
  secondIcon: React.ReactNode;
  selected?: boolean;
}

export const TokenPairCard = (props: TokenPairCardProps) => {
  const {firstToken, secondToken, selected, firstIcon, secondIcon} = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item>
          <Box>
            <Box className={classes.firstToken}>{firstIcon}</Box>
            <Box className={classes.secondToken}>{secondIcon}</Box>
          </Box>
        </Grid>
        <Grid item>
          <Typography>
            {firstToken}/{secondToken}
          </Typography>
        </Grid>
        <Grid item>
          <Radio checked={selected} color='primary' />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenPairCard;
