import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  TableContainer,
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
  Button,
  Paper,
  Box,
} from '@material-ui/core';
import {GameGraph} from '../utils/types';
import NFTLeagueGamesTableRow from './NFTLeagueGamesTableRow';
import {Skeleton} from '@material-ui/lab';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {GameStatus} from '../constants/enum';
import {useGamesGraph} from '../hooks/useGamesGraph';
import {useMobile} from 'hooks/useMobile';
import {Empty} from 'shared/components/Empty';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import {useHistory} from 'react-router';
import {NFTLEAGUE_ROUTE} from 'shared/constants/routes';
import Add from '@material-ui/icons/Add';
import {useIntl} from 'react-intl';
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
    account?: string;
  };
}

export const NFTLeagueGamesTable: React.FC<Props> = ({filters}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const history = useHistory();
  const isMobile = useMobile();
  const {formatMessage} = useIntl();

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

  const handleGoCreate = useCallback(
    () => history.push(`${NFTLEAGUE_ROUTE}/create`),
    [history],
  );

  const {data, isLoading} = useGamesGraph(
    filters.status,
    filters.account,
    rowsPerPage,
    page * rowsPerPage,
  );

  const renderRows = useCallback(() => {
    if (data !== undefined) {
      return data?.map((game: GameGraph) => (
        <NFTLeagueGamesTableRow game={game} />
      ));
    }

    return (
      isLoading &&
      new Array(6).fill(null).map((_, index: number) => (
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
      ))
    );
  }, [data, isLoading]);
  const callToAction = (
    <Button onClick={handleGoCreate} color='primary' startIcon={<Add />}>
      <IntlMessages id='nftLeague.createGame' defaultMessage='Create Game' />
    </Button>
  );

  return (
    <>
      {!isLoading &&
        data?.length === 0 &&
        filters.status === GameStatus.Waiting && (
          <Paper>
            <Box p={4}>
              <Empty
                image={<EmptyGame />}
                title={formatMessage({
                  id: 'nftLeague.noWaitingGames',
                  defaultMessage: 'No Waiting Games',
                })}
                message={formatMessage({
                  id: 'nftLeague.createAndShare',
                  defaultMessage: 'Create and share games',
                })}
                callToAction={callToAction}
              />
            </Box>
          </Paper>
        )}

      {((data && data?.length > 0) ||
        isLoading ||
        filters.status !== GameStatus.Waiting) && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component='th'>
                  <IntlMessages id='nftLeague.id' />
                </TableCell>
                <TableCell component='th'>
                  <IntlMessages id='nftLeague.entry' />
                </TableCell>
                <TableCell component='th'>
                  <IntlMessages id='nftLeague.status' defaultMessage='Status' />
                </TableCell>
                <Hidden smDown>
                  <TableCell component='th'>
                    <IntlMessages
                      id='nftLeague.starts'
                      defaultMessage='Starts'
                    />
                  </TableCell>
                  <TableCell component='th'>
                    <IntlMessages
                      id='nftLeague.endsIn'
                      defaultMessage='Ends/Duration'
                    />
                  </TableCell>
                </Hidden>
                <TableCell component='th'>
                  <IntlMessages id='nftLeague.players' />
                </TableCell>
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
                  colSpan={isMobile ? 5 : 6}
                  count={data?.length || 0}
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
      )}
    </>
  );
};

export default NFTLeagueGamesTable;
