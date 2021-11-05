import React from 'react';
import {
  makeStyles,
  ButtonBase,
  ButtonBaseProps,
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
}));

interface Props extends ButtonBaseProps {
  header: string | React.ReactNode;
  subheader: string | React.ReactNode;
  active?: boolean;
}

export default (props: Props) => {
  const {header, subheader, active} = props;
  const classes = useStyles();

  return (
    <ButtonBase {...props} className={clsx(props.className, classes.root)}>
      <Paper
        className={clsx(classes.paper, active ? classes.active : '')}
        variant='outlined'>
        <Box
          width={'100%'}
          alignItems='center'
          flexDirection='column'
          p={2}
          display='flex'>
          <Typography variant='body1' style={{fontWeight: 800}}>
            {header}
          </Typography>
          <Typography variant='body2'>{subheader}</Typography>
        </Box>
      </Paper>
    </ButtonBase>
  );
};
