import React, {useState, useCallback} from 'react';

import moment from 'moment';

import {
  Table,
  Grid,
  TableCell,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Collapse,
  useTheme,
} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {useMobile} from 'hooks/useMobile';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {GameGraph} from 'modules/CoinLeague/utils/types';

import {ethers} from 'ethers';

interface Props {
  game: string;
  data: GameGraph;
}

export const CoinLeagueHistoryTableItem: React.FC<Props> = ({game, data}) => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const {coinSymbol} = useLeaguesChainInfo();

  const handleToggleCollapse = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const isMobile = useMobile();

  const renderCoins = useCallback(() => {
    return false ? (
      <AvatarGroup>
        {/* {coins.map((coin: any, index: number) => (
          <Avatar key={index} />
        ))} */}
      </AvatarGroup>
    ) : null;
  }, []);

  const renderPlace = useCallback(() => {
    const earnings: any[] = (data as any).earnings;

    if (earnings.length > 0) {
      const place = parseInt(earnings[0].place) + 1;

      return (
        <Chip
          style={{color: theme.palette.success.main}}
          label={`${place}° place`}
        />
      );
    } else {
      return <Chip label={`Not winner`} />;
    }
  }, [data]);

  const getReward = useCallback(() => {
    const earnings: any[] = (data as any).earnings;

    if (earnings.length > 0) {
      const earning: any = earnings[0];

      if (earning.claimed) {
        return `${ethers.utils.formatUnits(earning.amount, 18)} ${coinSymbol}`;
      }
    }

    return `0 ${coinSymbol}`;
  }, [data]);

  return (
    <>
      <TableRow>
        <TableCell>{game}</TableCell>
        <TableCell>{data?.status}</TableCell>

        <TableCell>{renderPlace()}</TableCell>
        <TableCell>{getReward()}</TableCell>
        <TableCell>
          {data?.endedAt
            ? moment(parseInt(data?.endedAt) * 1000).format(
                'DD/MM/YYYY hh:mm:ss',
              )
            : null}
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
          <IconButton onClick={handleToggleCollapse}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{padding: 0}} colSpan={isMobile ? 3 : 7}>
          <Collapse in={open}>
            <Table>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <IconButton></IconButton>
                </TableCell>
              </TableRow>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CoinLeagueHistoryTableItem;
