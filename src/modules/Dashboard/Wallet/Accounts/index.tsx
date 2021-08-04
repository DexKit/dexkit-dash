import React, { useCallback, useState } from 'react';
import Box from "@material-ui/core/Box"
import PageTitle from "shared/components/PageTitle"
import GridContainer from '@crema/core/GridContainer';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { CremaTheme } from 'types/AppContextPropsType';
import ListSubheader from '@material-ui/core/ListSubheader';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Grid, Tooltip, Divider, Chip, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { addAccounts, removeAccount, setDefaultAccount, setAccountLabel } from 'redux/_ui/actions';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useWeb3 } from 'hooks/useWeb3';
import { green } from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';
import { AboutDialog } from './aboutDialog';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {isMobile} from 'web3modal';
import {AccountType, Network, Web3State} from 'types/blockchain';
import { UIAccount } from 'redux/_ui/reducers';
import EditIcon from '@material-ui/icons/Edit';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ClearIcon from '@material-ui/icons/Clear';
import { Fonts } from 'shared/constants/AppEnums';
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
  const [editLabel, setEditLabel] = useState<number | undefined>();
  const [label, setLabel] = useState<string>();
  const [copyText, setCopyText] = useState('Copy to clipboard') 

  const dispatch = useDispatch();
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(state => state.ui.accounts);
  const { web3State, onConnectWeb3, account } = useWeb3();

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
  const handleAddLabel = useCallback((acc: string, type: AccountType, network: Network) => {  
    dispatch(setAccountLabel({
      address: acc,
      label: label || acc,
      type,
      network
    }));
    setEditLabel(undefined);
  }, [setAccountLabel, setEditLabel, dispatch])

  const onRemoveLabel = useCallback(
    (acc: string, type: AccountType, network: Network) => {
    dispatch(setAccountLabel({
      address: acc,
      label: acc,
      type,
      network
    }));
  }, [setAccountLabel, dispatch])


  const onChangeLabel = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    setLabel(value);
  }
  const onAddAccount = useCallback(() => {
    if (address && Web3Wrapper.isAddress(address)) {
      dispatch(addAccounts([{
        address: address,
        label: address,
        type: AccountType.EVM,
        network: Network.ethereum
      }]));
    }
  },[address])

  const onMakeDefaultAccount = (a: UIAccount) => { 
      dispatch(setDefaultAccount(a));
  }
  const onRemoveAccount = (a: UIAccount) => {
    dispatch(removeAccount(a));
  }
  const connectButton = (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <Button
        variant='contained'
        color='primary'
        onClick={onConnectWeb3}
        endIcon={<AccountBalanceWalletIcon />}>
        {web3State === Web3State.Connecting
          ? isMobile()
            ? 'Connecting...'
            : 'Connecting... Check Wallet'
          : isMobile()
          ? 'Connect'
          : 'Connect Wallet'}
      </Button>
    </Box>
  );

  const notConnected = web3State !== Web3State.Done;
  

  const handleTooltipOpen = () => {
    setCopyText('Copied')
    setTimeout(()=> {
      setCopyText('Copy to clipboard')
    }, 1000)
  }

  const titleComponent = (
    <Box display='flex' alignItems='center' mt={1}>
         <AccountBoxIcon color={'primary'} fontSize={'large'}/>
      <Box
        component='h3'
        color='text.primary'
        fontWeight={Fonts.BOLD}
        mr={2}>
        Manage Accounts
      </Box>
      <AboutDialog />
    </Box>


  )


  return (
    <Box pt={{ xl: 4 }}>
      <Box display={'flex'}> 
      <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: '/dashboard/wallet', name: 'Wallet' },
          ],
          active: { name: `Manage` },
        }}
        title={{ name: 'Manage Accounts', component: titleComponent }}
      />
      </Box>
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
                         <Tooltip title={'Paste valid account'}>
                        <IconButton aria-label="paste" color="primary">
                          <CallReceivedIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>,
                }}
                onChange={onChangeAddress}
              />
            </form>
           
            <Box className={classes.inputAddress}>
               <Tooltip title={'Add valid account'}>
                <IconButton aria-label="add" color="primary" onClick={onAddAccount} disabled={!address}>
                  <AddIcon />
                </IconButton>
              </Tooltip>

            </Box>
          </Box>
        </Grid>
        {notConnected &&<Grid item xs={12} sm={12} md={4}>
         <Box>
            {connectButton}
            </Box>
           </Grid>}
        <Grid item xs={12} sm={12} md={9}>
          <Card>
            <List subheader={<ListSubheader>Accounts</ListSubheader>} className={classes.root} dense={true}>
              {accounts.map((a, i) =>
                <>
                  <ListItem>
                  {editLabel === i && 
                  
                  <ListItemText
                   id={a.address}
                    primary={ <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="standard-basic"
                      label="Add label"
                      defaultValue={a.label || a.address}
                      style={{minWidth: '350px'}}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end" onClick={() => handleAddLabel(a.address, a.type, a.network)}>
                              <Tooltip title={'Add Label'}>
                              <IconButton aria-label="paste" color="primary">
                                 <AddIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>,
                      }}
                      onChange={onChangeLabel}
                    />
                  </form>} />}
                  {editLabel !== i && <ListItemText id={a.address} primary={<>{a.label || a.address} 
                  {!Web3Wrapper.isAddress(a.label) && 
                  <>
                    <Tooltip title={a.address}>
                        <Chip label="Label" size={'small'} style={{marginLeft: '5px'}}/>
                   </Tooltip>
                   <Tooltip title={'Remove Label'}>
                        <IconButton aria-label="delete" color="secondary" onClick={() => onRemoveLabel(a.address, a.type, a.network)}>
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                   </>
                   }
                   </> 
                      
                
                } />}
               

                    {a.address !== account && <ListItemSecondaryAction>
                      
                      {i === 0 &&  <Chip label="Default" />}
                      {i !== 0  && 
                      <Tooltip title={'Make Default'}>
                        <IconButton aria-label="default" color="default" onClick={() => onMakeDefaultAccount(a)}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>}
                      <Tooltip title={'Add Label'}>
                        <IconButton aria-label="edit-label" color="default" onClick={()=> setEditLabel(editLabel === undefined ? i : undefined)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                        <Tooltip title={copyText}>
                             <IconButton aria-label="copy-clip" color="default">
                             <FileCopyIcon
                                onClick={() => {
                                  handleTooltipOpen();
                                  navigator.clipboard.writeText(a.address);
                                  document.execCommand('copy');
                                }}/>
                               </IconButton>
                          </Tooltip>
                     
                      <Tooltip title={'Remove Account'}>
                        <IconButton aria-label="delete" color="secondary" onClick={() => onRemoveAccount(a)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                     

                    </ListItemSecondaryAction>}



                    {a.address === account && <ListItemSecondaryAction>
                      {i !== 0  && <>
                      <Tooltip title={'Make Default'}>
                        <IconButton aria-label="default" color="default" onClick={() => onMakeDefaultAccount(a)}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>
                    
                      </>}
                      {i === 0 && <Chip label="Default" />}
                      <Tooltip title={'Connected Account'}>
                        <IconButton aria-label="connected" style={{ color: green[500] }}>
                          <FiberManualRecordIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Add Label'}>
                        <IconButton aria-label="edit-label" color="default" onClick={()=> setEditLabel(editLabel === undefined ? i : undefined)}>
                          <EditIcon />
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
