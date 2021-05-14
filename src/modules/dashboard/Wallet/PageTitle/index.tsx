import React from 'react';
import {GridContainer} from '@crema';
import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Link as MaterialLink,
  Typography,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Box,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { truncateAddress } from 'utils';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ButtonCopy from 'shared/components/ButtonCopy';


interface Props {
  history: {url: string; name: string, symbol?: string}[];
  active: string;
  title: string;
}

const PageTitle: React.FC<Props> = (props) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    breadcrumbs: {
      fontSize: '16px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '15px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '13px',
      },
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
      },
    },
  }));

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

   // return focus to the button when we transitioned from !open -> open
   const prevOpen = React.useRef(open);
   React.useEffect(() => {
     if (prevOpen.current === true && open === false) {
       anchorRef.current!.focus();
     }
 
     prevOpen.current = open;
   }, [open]);

   const handleClose = (event: React.MouseEvent<EventTarget>, index?: number) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  
  const classes = useStyles();

  const { ethAccounts } = useSelector<AppState, AppState['blockchain']>(
    ({ blockchain }) => blockchain,
  );
  const history = [
    {url:'/', name: 'Dashboard'},
    {url:'/dashboard/wallet', name: 'Wallet'}

  ]



  return (
    <GridContainer>
      <Grid item xs={12} md={12}>
        <Breadcrumbs className={classes.breadcrumbs} aria-label='breadcrumb'>
          {history.map((e) => (
            <Link key={e.name} color='inherit' to={e.url} component={MaterialLink}>
              {e.name}
            </Link>
          ))}
       {(ethAccounts && ethAccounts?.length > 1) &&   <>
         <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {(ethAccounts && ethAccounts?.length > 0) && truncateAddress(ethAccounts[0]) } <ButtonCopy copyText={ethAccounts[0]}  titleText='Copied to clipbord !'></ButtonCopy>
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {ethAccounts.map((a,i) => 
                      <MenuItem onClick={(e) => handleClose(e,i)}>{truncateAddress(a)} <ButtonCopy copyText={a}  titleText='Copied to clipbord !'></ButtonCopy></MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        </>}


        {(ethAccounts && ethAccounts?.length === 1) &&   
           <Typography className={classes.breadcrumbs} color='textPrimary'>
            {truncateAddress(ethAccounts[0])} <ButtonCopy copyText={ethAccounts[0]}  titleText='Copied to clipbord !'></ButtonCopy>
          </Typography>}
        </Breadcrumbs> 
        <Box display={'flex'}   alignItems={'center'}   >
          <Box pr={2}>
            <AccountBalanceWalletIcon color={'primary'}/> 
           </Box>
          <Typography className={classes.title} color='textPrimary'>
             Wallet
          </Typography>
        </Box>
      </Grid>
    </GridContainer>
  );
};

export default PageTitle;
