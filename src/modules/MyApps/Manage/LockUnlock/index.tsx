import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {Box, Card} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import CoinsInfo from './CoinsInfo';
import Transak from 'shared/components/Transak';

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

interface Props {
  balances: GetMyBalance_ethereum_address_balances[];
}

const LockUnlock: React.FC<Props> = ({balances}) => {
  // const [senderModal, setSenderModal] = useState(false);
  // const [receiverModal, setReceiverModal] = useState(false);

  const classes = useStyles();

  const [kit, setKit] = useState<any[]>([]);
  const [usd, setUsd] = useState<number>(0);

  useEffect(() => {
    const search = balances.filter((e) => e.currency?.symbol == 'KIT');

    if (search.length > 0) {
      setKit(search);
      setUsd(search[0].valueInUsd || 0);
    } else {
      setKit([
        {
          currency: {
            address: '',
            decimals: 18,
            name: 'DexKit',
            symbol: 'KIT',
            tokenType: '',
          },
          value: 0,
          valueUsd: 0,
        },
      ]);
    }
  }, [balances]);

  return (
    <>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{height: '100%'}}
        clone>
        <Card>
          <Box
            mb={3}
            display='flex'
            // flexDirection={{xs: 'column', xl: 'row'}}
            flexDirection={'row'}
            flexWrap={'wrap'}
            alignItems={{xl: 'center'}}
            justifyContent={'space-between'}>
            <Box display='flex' alignItems='center' mr={2}>
              {/* <Box
                component='h3'
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                ${usd.toFixed(2)}
              </Box> */}
              {/* <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Avl. Balance
              </Box> */}
              <CoinsInfo coins={kit} />
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Transak
                  variant='outlined'
                  size='medium'
                  className={classes.root}
                />
              </Box>
            </Box>
          </Box>

          {/* <Box pt={{lg: 5}}>
            <CoinsInfo coins={kit} />
          </Box> */}
        </Card>
      </Box>
    </>
  );
};

export default LockUnlock;
