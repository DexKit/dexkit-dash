import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Box, IconButton, makeStyles, Chip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PageviewIcon from '@material-ui/icons/Pageview';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {green, red} from '@material-ui/core/colors';
import {FavoriteCoin} from 'redux/_ui/reducers';
import DeleteIcon from '@material-ui/icons/Delete';
import {CremaTheme} from 'types/AppContextPropsType';
import {removeFavoriteCoin} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {CoinItemCoinGecko} from 'types/coingecko';
import Tooltip from '@material-ui/core/Tooltip';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    borderBottom: '0 none',
    fontSize: 13,
    padding: 8,
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
  },
  tableCellColor: {
    color: (props: {value: number}) =>
      props.value > 0 ? green[600] : red[600],
  },
  fontLIGHT: {},
  whitespaceNowrap: {
    whiteSpace: 'nowrap',
  },
  avatar: {
    width: 40,
    height: 40,
    padding: 12,
    backgroundColor: 'transparent',
    [theme.breakpoints.up('xl')]: {
      width: 50,
      height: 50,
    },
  },
}));

interface TableItemProps {
  row: FavoriteCoin;
  marketData?: CoinItemCoinGecko;
}

const TableItem: React.FC<TableItemProps> = ({row, marketData}) => {
  const classes = useStyles({
    value: marketData?.price_change_percentage_24h ?? 0,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteCoin = () => {
    dispatch(removeFavoriteCoin(row));
  };
  const isBSC = row.platforms?.['binance-smart-chain'];
  const isETH = row.platforms?.ethereum;

  const goToTradeETH = () => {
    history.push(`/${EthereumNetwork.ethereum}/dashboard/token/${isETH}`);
  };
  const goToTradeBSC = () => {
    history.push(`/${EthereumNetwork.bsc}/dashboard/token/${isBSC}`);
  };

  return (
    <TableRow className={clsx(classes.borderBottomClass, 'item-hover')}>
      <TableCell
        align='left'
        className={clsx(classes.tableCell, classes.whitespaceNowrap)}>
        <Box display='flex'>
          <Box mr={{xs: 3, xl: 5}}>
            {row.image.thumb ? (
              <Avatar className={classes.avatar}>
                <img src={row.image.thumb} alt='' />
              </Avatar>
            ) : (
              <Avatar className={classes.avatar}>
                <PageviewIcon />
              </Avatar>
            )}
          </Box>
          <Box component='span' mt={3} mr={1} fontWeight={700}>
            {row.name}
          </Box>
          <Box color='text.secondary' ml={1} mt={3}>
            ({row.symbol.toUpperCase()})
          </Box>
        </Box>
      </TableCell>
      <TableCell className={clsx(classes.tableCell, classes.fontLIGHT)}>
        ${marketData?.current_price ?? '-'}
      </TableCell>

      <TableCell
        className={clsx(
          classes.tableCell,
          classes.fontLIGHT,
          classes.whitespaceNowrap,
          classes.tableCellColor,
        )}>
        {(marketData && marketData?.price_change_percentage_24h) ?? '-'} %
      </TableCell>
      <TableCell align='right' className={classes.tableCell}>
        <IconButton aria-label='delete' onClick={deleteCoin} color='secondary'>
          <DeleteIcon />
        </IconButton>

        {isBSC && (
          <Tooltip title='Trade on BSC'>
            <Chip
              label={'BSC'}
              color='default'
              clickable
              style={{marginLeft: '5px'}}
              onClick={goToTradeBSC}
            />
          </Tooltip>
        )}

        {isETH && (
          <Chip
            label={'ETH'}
            color='default'
            clickable
            style={{marginLeft: '5px'}}
            onClick={goToTradeETH}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
