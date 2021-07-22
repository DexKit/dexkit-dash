import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { ChangellyCoin } from 'types/changelly';

interface Props{
    coins: ChangellyCoin[],
    onClick: any,
    onClose: any,
    open: any,
}


export const SelectCoinsDialog = (props: Props) => {
    const {open, onClose, coins} = props
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    return    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullScreen={fullScreen}>
                      <DialogTitle id="form-dialog-title">Select Coin</DialogTitle>
                      <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Search Coins"
                            fullWidth
                        />
                        {coins.map(c=> {
                            return <>{c.ticker}</>
                        })}




                      </DialogContent>
                </Dialog>




}