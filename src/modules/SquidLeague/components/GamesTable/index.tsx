import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Hidden,
  TableBody,
  TableFooter,
  TablePagination,
  makeStyles,
  Theme,
  IconButton,
  useTheme,
} from '@material-ui/core';
import GamesTableRow from './GamesTableRow';
import {Skeleton} from '@material-ui/lab';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {useGamesGraph} from 'modules/SquidLeague/hooks/useGamesGraph';
import {GameGraph} from 'modules/SquidLeague/utils/types';
import {GameStatus} from 'modules/SquidLeague/constants/enum';
import {Empty} from 'shared/components/Empty';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handleFirstPageButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, 0);
    },
    [onPageChange],
  );

  const handleBackButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    },
    [page, onPageChange],
  );

  const handleNextButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    },
    [page, onPageChange],
  );

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={count < rowsPerPage}
        aria-label='next page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </div>
  );
}

interface Props {
  filters: {
    status?: GameStatus;
  };
}

export const GamesTable: React.FC<Props> = ({filters}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  const {data, isLoading} = useGamesGraph(
    filters.status,
    rowsPerPage,
    page * rowsPerPage,
  );

  const renderRows = useCallback(() => {
    if (data?.data?.games?.length) {
      return data?.data?.games?.map((game: GameGraph) => (
        <GamesTableRow game={game} />
      ));
    }
    if (isLoading) {
      return new Array(6).fill(null).map((_, index: number) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <Hidden smDown>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
          </Hidden>
          <Hidden smUp>
            <TableCell>
              <Skeleton />
            </TableCell>
          </Hidden>
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <Empty title={'No Games'} message={'No games to display'} />
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    );
  }, [data, isLoading]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th'>
              <IntlMessages id='squidLeague.id' defaultMessage={'id'} />
            </TableCell>
            <TableCell component='th'>
              <IntlMessages id='squidLeague.entry' defaultMessage={'Entry'} />
            </TableCell>

            <Hidden smDown>
              <TableCell component='th'>
                <IntlMessages
                  id='squidLeague.startsAt'
                  defaultMessage={'Starts At'}
                />
              </TableCell>
              <TableCell component='th'>
                <IntlMessages
                  id='squidLeague.endsIn'
                  defaultMessage={'Ends In'}
                />
              </TableCell>
            </Hidden>
            <Hidden smUp>
              <TableCell></TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              labelRowsPerPage=''
              labelDisplayedRows={() => ''}
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={5}
              count={data?.data?.games?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {'aria-label': 'rows per page'},
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default GamesTable;
