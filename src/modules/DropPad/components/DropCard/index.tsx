import React, {useCallback} from 'react';

import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ethers} from 'ethers';
import {Drop} from 'modules/DropPad/utils/types';
import {useCountdown} from 'hooks/utils/useCountdown';
import {MintButton} from '../MintButton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.125rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  innerContent: {
    fontSize: '1rem',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '0.875rem',
    paddingBottom: theme.spacing(3),
  },
}));

interface Props {
  drop: Drop;
  onClick: (address: string) => void;
  btnMessage?: string;
}

const strPad = (str: number): string => {
  return (new Array(3).join('0') + str).slice(-2);
};

function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) - hours * 3600;
  const seconds = time - minutes * 60;

  return (
    <Grid item>
      <Typography variant='subtitle2'>
        in {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

const DropCard = (props: Props): JSX.Element => {
  const {drop, onClick} = props;
  const classes = useStyles();

  const entryAmount = ethers.utils.formatEther(drop.price);
  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(drop.address);
    },
    [drop.address],
  );

  const countEarly = useCountdown(
    new Date((drop.earlyAccessDate || 0) * 1000),
    {
      interval: 1000,
    },
  );

  const countOpen = useCountdown(new Date(drop.startDate * 1000), {
    interval: 1000,
  });

  return (
    <Container className={classes.container} maxWidth={'sm'}>
      <Typography variant='h6'>{drop.name}</Typography>
      <Grid container spacing={2} className={classes.innerContent}>
        <Grid xs={12} item>
          <img src={drop.imageURL} alt='' />
        </Grid>
        <Grid xs={12} item>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='subtitle2'>Price </Typography>
            <Typography
              variant='h6'
              style={{color: '#fcc591', alignItems: 'baseline'}}>
              &nbsp;{entryAmount} {'MATIC'}
            </Typography>
          </Box>
        </Grid>

        <Grid xs={12} item>
          <Grid
            container
            className={`${classes.innerContent} ${classes.smallContent}`}>
            <Grid item>
              <Typography variant='subtitle2'>Early Access</Typography>
              {countEarly && countEarly > 0 ? (
                <CardTimer time={countEarly} />
              ) : (
                <Typography variant='subtitle2'>Ready </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant='subtitle2'>Open Access</Typography>
              {countOpen && countOpen > 0 ? (
                <CardTimer time={countOpen} />
              ) : (
                <Typography variant='subtitle2'>Ready </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MintButton address={drop.address} />

      {/* <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || 'ENTER DROP'}
              </Button>*/}
    </Container>
  );
};

export default DropCard;
