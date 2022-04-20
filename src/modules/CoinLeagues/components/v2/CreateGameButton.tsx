import React from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {ReactComponent as GameIcon} from '../../assets/game.svg';
import {Box, ButtonBase, Grid, Typography, withStyles} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

const CustomButton = withStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    padding: theme.spacing(4),
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
}))(ButtonBase);

const CircleBox = withStyles((theme) => ({
  root: {
    height: theme.spacing(12),
    width: theme.spacing(12),
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
  },
}))(Box);

export const CreateGameButton = ({onClick}: {onClick: () => void}) => {
  return (
    <CustomButton onClick={onClick}>
      <Grid container spacing={4} alignItems='center' alignContent='center'>
        <Grid item>
          <CircleBox>
            <GameIcon />
          </CircleBox>
        </Grid>
        <Grid item xs>
          <Typography align='left' variant='body1'>
            <IntlMessages
              id='app.coinLeague.createGame'
              defaultMessage='Create Game'
            />
          </Typography>
          <Typography align='left' variant='body2' color='textSecondary'>
            <IntlMessages
              id='app.coinLeague.coinLeague'
              defaultMessage='Coin League'
            />
          </Typography>
        </Grid>
        <Grid item>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <NavigateNextIcon />
          </Box>
        </Grid>
      </Grid>
    </CustomButton>
  );
};

export default CreateGameButton;
