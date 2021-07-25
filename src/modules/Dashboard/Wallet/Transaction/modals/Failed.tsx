import React from 'react';

import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  aligned: {textAlign: 'center', width: '100%'},
  button: {position: 'absolute', bottom: '5%', right: '5%', width: '90%'},
  paper: {
    position: 'absolute',
    margin: 'auto',
    width: 500,
    height: 250,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Failed: React.FC<any> = ({open, setOpen}) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={() => setOpen(false)} className={classes.paper}>
      <div className={classes.aligned}>
        <Box style={{marginBottom: 100}}>
          <Typography variant='h2'>Failed!</Typography>
          <Divider style={{margin: 10}} />
          <Typography>
            Unfortunately, your transaction has not been done successfully!
          </Typography>
        </Box>
        <Box className={classes.button}>
          <Button
            onClick={() => setOpen(false)}
            color='primary'
            style={{width: '100%'}}
            variant='contained'>
            Close
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default Failed;
