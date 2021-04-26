import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TableCell, TableRow} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {grey} from '@material-ui/core/colors';
import { TokenStatistic } from 'types/app';
import { useIntl } from 'react-intl';

interface Props {
  data: TokenStatistic|undefined;
}

const CTable: React.FC<Props> = ({data}) => {
  const useStyles = makeStyles(() => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',

      '@media (max-width: 767px)': {
        width: '100%',
        marginBottom: 15,
        overflowY: 'hidden',
        border: `1px solid ${grey[300]}`,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
  }));

  const classes = useStyles();

  const {messages} = useIntl()

  return (
    <Box className={classes.tableResponsiveMaterial}>
      <Table className='table'>
        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>
        <TableBody className={classes.borderBottomClass}>
          {
            data ? (
              <>
                <TableItem row={{title: messages['app.transferCount'], data: data.transferCount}} key={0} />
                <TableItem row={{title: messages['app.uniqSenders'], data: data.uniqSenders}} key={1} />
                <TableItem row={{title: messages['app.uniqReceivers'], data: data.uniqSenders}} key={2} />
                <TableItem row={{title: messages['app.totalAmount'], data: data.totalAmount}} key={3} />
                <TableItem row={{title: messages['app.medianTransferAmount'], data: data.medianTransferAmount}} key={4} />
                <TableItem row={{title: messages['app.averageTransferAmount'], data: data.averageTransferAmount}} key={5} />
                <TableItem row={{title: messages['app.firstTransferDate'], data: data.firstTransferDate}} key={6} />
                <TableItem row={{title: messages['app.lastTransferDate'], data: data.lastTransferDate}} key={7} />
                <TableItem row={{title: messages['app.daysTokenTransfered'], data: data.daysTokenTransfered}} key={8} />
              </>
            ) : (
              <TableRow className={classes.borderBottomClass}>
                <TableCell component='th' scope='row' colSpan={2} className={classes.borderBottomClass}>
                  Loading...
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </Box>
  );
};

export default CTable;
