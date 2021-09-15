import React from 'react';

import {
  Paper,
  Grid,
  makeStyles,
  Box,
  Typography,
  ButtonBase,
  useTheme,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {ReactComponent as TokensGroupActionIcon} from 'assets/images/widgets/tokens-group-action.svg';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '100%',
    height: 'auto',
  },
  paper: {
    backgroundColor: '#2A2C31',
    cursor: 'pointer',
    borderRadius: 6,
    width: '100%',
  },
}));

interface TokensGroupActionButtonProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export const TokensGroupActionButton = (
  props: TokensGroupActionButtonProps,
) => {
  const {title, subtitle, onClick} = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper component={ButtonBase} className={classes.paper} onClick={onClick}>
      <Grid container alignItems='center'>
        <Grid item>
          <TokensGroupActionIcon className={classes.img} />
        </Grid>
        <Grid item xs>
          <Box p={4}>
            <Typography align='left' gutterBottom variant='body1'>
              {title}
            </Typography>
            <Typography
              align='left'
              color='textSecondary'
              gutterBottom
              variant='body2'>
              {subtitle}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box p={4}>
            <ChevronRightIcon color='primary' fontSize='large' />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
