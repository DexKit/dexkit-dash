import React, {useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {makeStyles} from '@material-ui/core/styles';

import CloseIcon from '@material-ui/icons/Close';
import TransferIcon from 'src/assets/images/icons/bitcoin-convert-white.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 15,
    width: '60%',
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  formControl: {
    padding: theme.spacing(0.5),
  },
  radio: {
    width: '100%',
    borderRadius: 6,
    border: '1px solid #525C75',
    margin: theme.spacing(0.5),
    backgroundColor: '#3C4255',
  },
  label: {
    color: '#fff',
    flex: 'auto',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  input: {
    borderRadius: 6,
    border: '1px solid #525C75',
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  innerContent: {
    color: '#fff',
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    justifyContent: 'space-between',
  },
}));

interface Props {}

function CreateGameModal(props: Props): JSX.Element {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [coins, setCoins] = useState<number>();
  const [gameType, setGameType] = useState('winner-game');
  const [entryAmount, setEntryAmount] = useState<number>();
  const [totalPlayers, setTotalPlayers] = useState<number>();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameType((event.target as HTMLInputElement).value);
  }

  return (
    <Dialog open={open}>
      <Container className={classes.container} maxWidth='xs'>
        <Grid container style={{paddingLeft: 10, paddingRight: 5}}>
          <Grid item xs={11}>
            <Typography variant='h6'>
              <TransferIcon />
              Create a game
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => setOpen(false)} size='small'>
              <CloseIcon style={{color: '#fff'}} />
            </IconButton>
          </Grid>
        </Grid>

        <Divider
          style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: '#525C75',
          }}
        />

        <Grid container className={classes.innerContent}>
          <Typography variant='h6' style={{fontWeight: 600}}>
            Basic information
          </Typography>
          <Typography variant='subtitle2'>
            Answer all of the options below to continue
          </Typography>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>Entry amount</FormLabel>
            <TextField
              variant='outlined'
              size='small'
              inputMode='decimal'
              value={entryAmount}
              inputProps={{
                style: {
                  color: '#fff',
                  borderRadius: 6,
                  border: '1px solid #525C75',
                  backgroundColor: '#3C4255',
                },
              }}
              placeholder='enter a value'
            />
          </FormControl>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>Game duration</FormLabel>
            <Select
              variant='outlined'
              placeholder='Select'
              style={{
                color: '#fff',
                borderRadius: 6,
                backgroundColor: '#3C4255',
              }}>
              <MenuItem value={10}>1 hr</MenuItem>
              <MenuItem value={20}>2 hrs</MenuItem>
              <MenuItem value={30}>3 hrs</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          container
          className={classes.innerContent}
          style={{marginRight: 10}}>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
                How many coins?
              </FormLabel>
              <Select
                value={coins}
                variant='outlined'
                placeholder='Select'
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: {color: '#fff', backgroundColor: '#3C4255'},
                }}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
                Total players
              </FormLabel>
              <Select
                value={totalPlayers}
                variant='outlined'
                placeholder='Select'
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: {color: '#fff', backgroundColor: '#3C4255'},
                }}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid
          container
          className={`${classes.innerContent} ${classes.formControl}`}>
          <FormControl fullWidth component='fieldset'>
            <FormLabel
              className={classes.label}
              style={{fontSize: '1.25rem', fontWeight: 600}}>
              Game type
            </FormLabel>
            <RadioGroup value={gameType}>
              <FormControlLabel
                value='winner-game'
                label='Winner Game'
                onClick={() => setGameType('winner-game')}
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
              <FormControlLabel
                value='loser-game'
                onClick={() => setGameType('loser-game')}
                label='Loser Game'
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Button
          fullWidth
          className={classes.button}
          disabled={!!coins && !!entryAmount && !!totalPlayers}>
          CREATE A GAME
        </Button>
      </Container>
    </Dialog>
  );
}

export default CreateGameModal;
