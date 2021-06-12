import React, { useState } from 'react';
import Box from "@material-ui/core/Box"
import PageTitle from "shared/components/PageTitle"
import GridContainer from '@crema/core/GridContainer';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { CremaTheme } from 'types/AppContextPropsType';
import ListSubheader from '@material-ui/core/ListSubheader';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Grid, Tooltip, Divider, Chip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { addAccounts, removeAccount, setDefaultAccount } from 'redux/_ui/actions';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useWeb3 } from 'hooks/useWeb3';
import { green } from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    width: '100%',

  },
  inputAddress: {
    display: 'flex',
  },
}));


const Accounts = () => {
  const classes = useStyles();
  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const dispatch = useDispatch();
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(state => state.ui.accounts);
  const { account } = useWeb3();

  const handlePaste = async () => {
    const cpy: any = await navigator.clipboard.readText();
    setAddress(cpy);
  }
  const onChangeAddress = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    if (Web3Wrapper.isAddress(value)) {
      setError('')
      setAddress(value)
    } else {
      if (value) {
        setError('Address not valid')
      } else {
        setError('')
      }

    }
  }
  const onAddAccount = () => {
    if (address && Web3Wrapper.isAddress(address)) {
      dispatch(addAccounts([address]));
    }

  }

  const onMakeDefaultAccount = (a: string) => { 
      dispatch(setDefaultAccount(a));
  }
  const onRemoveAccount = (a: string) => {
    dispatch(removeAccount(a));
  }



  return (
    <Box pt={{ xl: 4 }}>
      <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: '/dashboard/wallet', name: 'Wallet' },
          ],
          active: { name: `Manage` },
        }}
        title={{ name: 'Manage Accounts' }}
      />
      <GridContainer>
        <Grid item xs={12} sm={12} md={4}>
          <Box className={classes.inputAddress}>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField id="standard-basic"
                label="Add Address"
                fullWidth
                helperText={error}
                error={!!error}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end" onClick={handlePaste}>
                      <IconButton aria-label="paste" color="primary">
                        <CallReceivedIcon />
                      </IconButton>
                    </InputAdornment>,
                }}
                onChange={onChangeAddress}
              />
            </form>
            <Box className={classes.inputAddress}>
              <IconButton aria-label="add" color="primary" onClick={onAddAccount} disabled={!address}>
                <AddIcon />
              </IconButton>

            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={9}>
          <Card>
            <List subheader={<ListSubheader>Accounts</ListSubheader>} className={classes.root}>
              {accounts.map((a, i) =>
                <>
                  <ListItem>

                    <ListItemText id={a} primary={a} />
                    {a !== account && <ListItemSecondaryAction>
                      {i === 0 && <Chip label="Default" />}
                      {i !== 0  && 
                      <Tooltip title={'Make Default'}>
                        <IconButton aria-label="default" color="default" onClick={() => onMakeDefaultAccount(a)}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>}
                     
                      <Tooltip title={'Remove Account'}>
                        <IconButton aria-label="delete" color="secondary" onClick={() => onRemoveAccount(a)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      

                    </ListItemSecondaryAction>}
                    {a === account && <ListItemSecondaryAction>
                      {i !== 0  && 
                      <Tooltip title={'Make Default'}>
                        <IconButton aria-label="default" color="default" onClick={() => onMakeDefaultAccount(a)}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>}
                      {i === 0 && <Chip label="Default" />}
                      <Tooltip title={'Connected Account'}>
                        <IconButton aria-label="connected" style={{ color: green[500] }}>
                          <FiberManualRecordIcon />
                        </IconButton>
                      </Tooltip>

                    </ListItemSecondaryAction>}
                  </ListItem>
                  <Divider light />
                </>
              )}

            </List>

          </Card>
        </Grid>
      </GridContainer>
    </Box>
  );

}

export default Accounts;
