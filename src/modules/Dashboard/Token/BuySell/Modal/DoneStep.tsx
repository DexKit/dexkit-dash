import React, {useEffect} from 'react';
import {Button, Typography} from '@material-ui/core';
import {Steps} from 'types/app';
import {useStyles} from './index.style';
import {NotificationType} from 'services/notification';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';

interface Props {
  step: Steps;
  onClose: () => void;
}

const DoneStep: React.FC<Props> = (props) => {
  const {step, onClose} = props;

  const classes = useStyles();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (step === Steps.DONE) {
  //     console.log('START DONE');

  //     const notification: Notification = {
  //       title: 'Order',
  //       body: 'Successfully created',
  //     };
  //     dispatch(onAddNotification([notification], NotificationType.SUCCESS));
  //   }
  // }, [step]);

  return (
    <>
      {/* <Typography align='center' style={{paddingBottom: 10}}>
        Order completed!
      </Typography> */}
      <Button
        style={{margin: 0}}
        fullWidth
        variant='outlined'
        color='primary'
        size='large'
        onClick={onClose}>
        Done
      </Button>
    </>
  );
};

export default DoneStep;
