import React from 'react';
import clsx from 'clsx';
import {useHistory} from 'react-router-dom';
import {
  makeStyles,
  Box,
  TableCell,
  TableRow,
  Button,
  Avatar,
  Chip,
  Tooltip,
} from '@material-ui/core';
import {green, grey} from '@material-ui/core/colors';
import PageviewIcon from '@material-ui/icons/Pageview';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import TokenLogo from 'shared/components/TokenLogo';
import {MyBalances} from 'types/blockchain';
import { useDefaultAccount } from 'hooks/useDefaultAccount';

interface TableItemProps {
  data: MyBalances;
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
        paddingLeft: 2,
         [theme.breakpoints.up('xl')]: {
           paddingLeft: 20,
         },
       
      },
      '&:last-child': {
        paddingRight: 2,
         [theme.breakpoints.up('xl')]: {
           paddingRight: 20,
         },
        
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
      width: 30,
      height: 30,
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

  const account = useDefaultAccount();

  const getNetworkLink = (d: MyBalances) => {
    if (d.network === EthereumNetwork.bsc) {
      return `/${EthereumNetwork.bsc}/dashboard/token/`;
    }
    return `/${EthereumNetwork.ethereum}/dashboard/token/`;
  };

  const getTradeNetworkLink = (d: MyBalances) => {
    if (d.network === EthereumNetwork.bsc) {
      return `/${EthereumNetwork.bsc}/history/trade/list`;
    }
    return `/${EthereumNetwork.ethereum}/history/trade/list`;
  };

  return (
    <TableRow key={data.currency?.address} className='item-hover' hover>
      <TableCell
        align='left'
        className={clsx(classes.tableCell, classes.whitespaceNowrap)}>
        <Box display='flex'>
          <Box mr={{xs: 3, xl: 5}}>
            {data.currency?.address ? (
              <TokenLogo token0={data.currency?.address} />
            ) : (
              // data.currency?.address == '-' ? (
              //   <Avatar className={classes.avatar} src={data.currency?.address}>
              //     {/* <img src={'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'} alt='' /> */}
              //   </Avatar>
              // ) : (
              //   <Avatar className={classes.avatar} src={data.currency?.address}>
              //     {/* <img src={'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + ethers.utils.getAddress(data.currency.address.toLowerCase()) + '/logo.png'} alt='' /> */}
              //   </Avatar>
              // )
              <Avatar className={classes.avatar}>
                <PageviewIcon />
              </Avatar>
            )}
          </Box>
          <Box component='span' mr={1} fontWeight={700}>
            <Box>{data.currency?.name}</Box>
            <Box>
              {data.network === EthereumNetwork.bsc && (
                <Chip size='small' label='BSC' />
              )}
              {data.network === EthereumNetwork.ethereum && (
                <Chip size='small' label='ETH' />
              )}
            </Box>
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
          variant='outlined'
          onClick={() => {
            history.push(getNetworkLink(data) + data.currency?.address);
          }}>
          Trade
        </Button>
        <Button
          variant='outlined'
          style={{marginLeft: '2px'}}
          onClick={() => {
            history.push(`${getTradeNetworkLink(data)}/${account}/token/${data.currency?.address}`);
          }}>
          History
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
