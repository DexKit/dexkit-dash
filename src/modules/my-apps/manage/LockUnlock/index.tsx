import React from 'react';
import { useHistory } from 'react-router';
import {Box, Button, Card} from '@material-ui/core';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IntlMessages from '@crema/utility/IntlMessages';
import {CremaTheme} from 'types/AppContextPropsType';
import {MyBalance} from 'types/bitquery/myBalance.interface';
import CoinsInfo from './CoinsInfo';
import { Fonts } from 'shared/constants/AppEnums';

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    backgroundColor: 'white',
    color: 'text.primary',
    fontFamily: Fonts.LIGHT,
    textTransform: 'capitalize',
    width: 96,
    fontSize: 16,
    '&:hover, &:focus': {backgroundColor: 'white', color: 'text.primary'},
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

interface Props {
  balances: MyBalance[];
}

const LockUnlock: React.FC<Props> = (props) => {
  // const [senderModal, setSenderModal] = useState(false);
  // const [receiverModal, setReceiverModal] = useState(false);

  const history = useHistory();
  const classes = useStyles();


  return (
    <Box>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{backgroundColor: indigo[500]}}
        clone>
        <Card>
          <Box
            mb={{xs: 3, md: 6, xl: 8}}
            display='flex'
            flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}>
            <Box display='flex' alignItems='center'>
              <Box
                component='h3'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                ${props.balances[0]?.valueUsd?.toFixed(2) || 0}
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Avl. Balance
              </Box>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Button onClick={() => { history.push('/dashboard/token/') }} className={classes.root}>
                  <IntlMessages id='common.buy' />
                </Button>
              </Box>
            </Box>
          </Box>

          <Box pt={{xl: 5}}>
            <CoinsInfo coins={props.balances} />
          </Box>
        </Card>
      </Box>
      
      {/* <Sender open={senderModal} onClose={() => setSenderModal(false)} balances={balances} /> */}
      
      {/* <Receiver open={receiverModal} onClose={() => setReceiverModal(false)} /> */}

    </Box>
  );
};

export default LockUnlock;
