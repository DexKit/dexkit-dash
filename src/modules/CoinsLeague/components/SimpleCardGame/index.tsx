import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {ethers} from 'ethers';
import {truncateAddress} from 'utils/text';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    fontSize: '1rem',
  },
}));

interface Props {
  address: string;
  duration: ethers.BigNumber;
  amount_to_play: ethers.BigNumber;
}

function SimpleCardGame(props: Props): JSX.Element {
  const classes = useStyles();
  const {duration, address, amount_to_play} = props;
  const id = address;
  const time = duration.toNumber();
  const entryAmount = ethers.utils.formatEther(amount_to_play);
  return (
    <Container className={classes.container}>
      <Grid
        container
        style={{color: '#7a8398'}}
        spacing={2}
        alignContent={'center'}
        alignItems={'center'}>
        <Grid item xs={12} sm={12}>
          <Box display={'flex'}>
            <Typography variant='h6'>Game Time:</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              &nbsp;{Math.floor(time / 3600)}Hrs
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>ID #{truncateAddress(id)}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <SendIcon />
            <Typography
              variant='h6'
              style={{color: '#fcc591', fontWeight: 600}}>
              &nbsp;{entryAmount} {'MATIC'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SimpleCardGame;
