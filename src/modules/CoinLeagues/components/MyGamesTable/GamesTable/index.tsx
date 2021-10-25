import React from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';
import {Empty} from 'shared/components/Empty';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';

interface Props {
  data: any;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const GamesTable: React.FC<Props> = ({
  data,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>{!isMobile && <TableHeading />}</TableHead>

          <TableBody>
            {data &&
              data.map((row: any, index: any) => (
                <TableItem key={index} row={row} />
              ))}
          </TableBody>
        </Table>
      </Box>
      {!data?.length && (
        <Empty
          image={<EmptyGame />}
          title={messages['app.noGamesHistory'] as string}
          message={messages['coinLeagues.warning.joinGame'] as string}
        />
      )}
      <Box p={2} mr={7}>
        <TablePagination
          className={classes.paginationDesktop}
          component='div'
          count={data.length}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={(event: unknown, newPage: number) =>
            onChangePage(newPage)
          }
          onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChangeRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </Box>
    </>
  );
};

export default GamesTable;
