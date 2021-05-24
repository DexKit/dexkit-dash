
import React from 'react';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../types/AppContextPropsType';
import { makeStyles, Box, Button } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';



const StakeBoard: React.FC<any> = () => {
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

  return (
    <Box>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{backgroundColor: indigo[500]}}
        >
            <Box display='flex' alignItems='center'>
              <Box
                component='h3'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                200
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Kit Staked this Epoch
              </Box>
            </Box>
            <Box display='flex' alignItems='center'>
              <Box
                component='h3'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                200
              </Box>
              <Box
                component='span'
                ml={3}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Kit Staked Previous Epoch
              </Box>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Button className={classes.root}>
                  Stake
                </Button>
              </Box>
              <Box ml={3}>
                <Button className={classes.btnPrimary}>
                  Withdraw 
                </Button>
              </Box>
            </Box>
        <span>Your Kit Net is positive, you are able to withdraw this rewards at epoch 7</span>
      </Box>
    </Box>
  );
};

export default StakeBoard;
