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
import {KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import IconButton from '@material-ui/core/IconButton';


interface Props {
  data: any;
  currentPage: number;
  isNFT: boolean;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TableActions = (props: any) => {
  const {page, count, rowsPerPage, onPageChange} = props;

  const handleFirstPage = (event: any) => {
    onPageChange(event, 1);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box ml={2} display='flex' alignItems='center' alignContent='center'>
      <IconButton disabled={page === 0} onClick={handleFirstPage}>
        <FirstPageIcon />
      </IconButton>
      <IconButton disabled={page === 0} onClick={handleBackButtonClick}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        disabled={count < rowsPerPage}
        onClick={handleNextButtonClick}>
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

const GamesTable: React.FC<Props> = ({
  data,
  isNFT,
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
                <TableItem key={index} row={row} isNFT={isNFT}/>
              ))}
          </TableBody>
        </Table>
      </Box>
      {!data?.length && (
        <Empty
          image={<EmptyGame />}
          title={messages['app.coinLeagues.noGamesHistory'] as string}
          message={messages['coinLeagues.warning.joinGame'] as string}
        />
      )}
      <Box p={2} mr={7}>
        <TablePagination
          className={classes.paginationDesktop}
          component='div'
          count={data?.length || 0}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={(event: unknown, newPage: number) =>
            onChangePage(newPage)
          }
          onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChangeRowsPerPage(parseInt(event.target.value, 10))
          }
          ActionsComponent={TableActions}
        />
      </Box>
    </>
  );
};

export default GamesTable;
