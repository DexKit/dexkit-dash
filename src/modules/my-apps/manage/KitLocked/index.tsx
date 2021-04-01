import React, { useState } from 'react';
import {Card} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import { useHistory } from 'react-router-dom';

import {CremaTheme} from '../../../../types/AppContextPropsType';

import { useWeb3 } from 'hooks/useWeb3';
import Modal from 'shared/components/Modal';



const KitLocked: React.FC = () => {
  const { ethBalance, onActionWeb3Transaction, account } = useWeb3();
  const [ currentToken ] = useState('0x0000000000000000000000000000000000000000'); //mock token
  const [open, setOpen] = React.useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };
  const handleModalConfirm = async () => {
    try{
      const result = await onActionWeb3Transaction({
        to: currentToken,
        from: account,
        value: ethBalance.toNumber()
      });
      console.log('transaction result', result);
    }catch(e){
      console.error('transaction error', e);
    }
  };
  const useStyles = makeStyles((theme: CremaTheme) => ({
    root: {
      backgroundColor: 'white',
      color: 'black',
      fontFamily: Fonts.LIGHT,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {backgroundColor: 'white', color: 'black'},
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
    btnPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fontFamily: Fonts.LIGHT,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
  }));
  const classes = useStyles();
  const history = useHistory();
  const onGoToken = () => {
    history.push(`/dashboards/token/${currentToken}`);
  }
  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={{xs: 18, sm: 20, xl: 22}}
        mb={{xs: 4, sm: 4, xl: 6}}
        fontFamily={Fonts.LIGHT}>
        Kit Locked Balance
      </Box>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{backgroundColor: indigo[500]}}
        clone>
        <Card>
          <Box
            mb={{xs: 3, md: 12, xl: 12}}
            display='flex'
            flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}>
            <Box display='flex' alignItems='center'>
              <Box
                component='h5'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                {ethBalance.toNumber()} Kit
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                <IntlMessages id='dashboard.avlBalance' />
              </Box>
              <Box
                component='h5'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                250 Kit
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Locked
              </Box>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Button 
                className={classes.root} 
                size='large'
                onClick={onGoToken}
                >
                  Buy 
                </Button>
              </Box>
              <Box ml={3}>
                <Button className={classes.btnPrimary} size='large' onClick={handleModalOpen}>
                 Lock
                </Button>
              </Box>
              <Box ml={3}>
                <Button variant="contained" color="secondary" size='large'>
                 Unlock
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
      <Modal 
      open={open} 
      onClose={handleModalClose} 
      onConfirm={handleModalConfirm} 
      address={currentToken} 
      value={ethBalance.toString()}
      ></Modal>
    </Box>
  );
};

export default KitLocked;
