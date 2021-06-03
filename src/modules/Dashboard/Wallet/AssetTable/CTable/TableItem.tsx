import React from 'react';
import clsx from 'clsx';
import {useHistory} from 'react-router-dom';
import {makeStyles, Box, TableCell, TableRow, Button, Avatar} from '@material-ui/core';
import {green, grey} from '@material-ui/core/colors';
import PageviewIcon from '@material-ui/icons/Pageview';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import TokenLogo from 'shared/components/TokenLogo';

interface TableItemProps {
  data: GetMyBalance_ethereum_address_balances;
}

const TableItem: React.FC<TableItemProps> = ({data}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableCell: {
      borderBottom: '0 none',
      fontSize: 12,
      padding: 6,
      '&:first-child': {
        // [theme.breakpoints.up('xl')]: {
        //   paddingLeft: 4,
        // },
        paddingLeft: 20,
      },
      '&:last-child': {
        // [theme.breakpoints.up('xl')]: {
        //   paddingRight: 4,
        // },
        paddingRight: 20,
      },
      // [theme.breakpoints.up('xl')]: {
      //   fontSize: 18,
      //   padding: 16,
      // },
    },
    tableCellColor: {
      color: green[600],
    },
    fontBold: {
      fontFamily: Fonts.MEDIUM,
    },
    whitespaceNowrap: {
      whiteSpace: 'nowrap',
    },
    avatar: (props: any) => ({
      width: 40,
      height: 40,
      padding: 0,
      backgroundColor: data?.currency?.address ? props.color : grey[500],
      [theme.breakpoints.up('xl')]: {
        width: 50,
        height: 50,
      },
    }),
  }));
  const classes = useStyles(data);

  const history = useHistory();

  return (
    <TableRow key={data.currency?.address} className='item-hover' hover>
      <TableCell
        align='left'
        className={clsx(classes.tableCell, classes.whitespaceNowrap)}>
        <Box display='flex'>
          <Box mr={{xs: 3, xl: 5}}>
            {data.currency?.address ? (
              <TokenLogo token0={data.currency?.address} />
              // data.currency?.address == '-' ? (
              //   <Avatar className={classes.avatar} src={data.currency?.address}>
              //     {/* <img src={'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'} alt='' /> */}
              //   </Avatar>
              // ) : (
              //   <Avatar className={classes.avatar} src={data.currency?.address}>
              //     {/* <img src={'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + ethers.utils.getAddress(data.currency.address.toLowerCase()) + '/logo.png'} alt='' /> */}
              //   </Avatar>
              // )
            ) : (
              <Avatar className={classes.avatar}>
                <PageviewIcon />
              </Avatar>
            )}
          </Box>
          <Box component='span' mt={3} mr={1} fontWeight={700}>
            {data.currency?.name}
          </Box>
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box color='grey.500'>${data?.valueInUsd?.toFixed(2)}</Box>
        <Box>
          {data.value} {data.currency?.symbol}
        </Box>
      </TableCell>

      <TableCell align='center' className={classes.tableCell}>
        {/* <Button style={{marginRight: 10}} variant="contained" color="secondary"  >
          Send
        </Button> */}
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            history.push('/ethereum/dashboard/token/' + data.currency?.address);
          }}>
          Trade
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
