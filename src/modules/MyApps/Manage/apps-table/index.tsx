import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';

import {Loader} from '@crema';
import ConfirmationDialog from '@crema/core/ConfirmationDialog';

import {useStyles} from './index.style';

import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import {stableSort, getComparator} from 'utils/table';
import { useMyAppsConfig } from 'hooks/myApps/useMyAppsConfig';
import { useWeb3 } from 'hooks/useWeb3';
import { onAddNotification, setInsufficientAmountAlert } from 'redux/actions';
import { WhitelabelTypes } from 'types/myApps';
import { useBalance } from 'hooks/balance/useBalance';
// import { Notification } from 'types/models/Notification';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
  align?: 'left' | 'right';
  isSort: boolean;
}

const headCells: HeadCell[] = [
  {id: 'slug', label: 'Id', isSort: false},
  {id: 'domain', align: 'left', label: 'Domain', isSort: true},
  {id: 'type', align: 'left', label: 'Type', isSort: false},
//  {id: 'collectedFees', align: 'left', label: 'Collected Fees', isSort: true},
  {id: 'expireds', align: 'left', label: 'Status', isSort: false},
  {id: 'actions', align: 'left', label: 'Actions', isSort: false},
];

const data = [
  {
    id: 1,
    name: 'Project',
    domain: 'project.com',
    collectedFees: 200,
  },
];

const AppsTable = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('collectedFees');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showDialog, setShowDialog] = useState(false);
  const { account } = useWeb3();
  const {configs, loading} = useMyAppsConfig(account);
  const { error, data: balances } = useBalance();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const apps = configs?.filter( config => config?.active) ?? [];
    const kitsCost = apps.reduce((cost, app) => {
      if(app.type === 'DEX'){
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_EXCHANGE);
      }
      if(app.type === 'AGGREGATOR'){
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_AGGREGATOR);
      }
      if(app.type === 'MARKETPLACE'){
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_MARKETPLACE); 
      }
      return cost;
      
    }, 0);
    const kitBalance = balances?.filter( b => b?.currency?.symbol?.toUpperCase() === 'KIT') ?? [];
    const kitAmount = kitBalance.reduce((amount, k) => {
      const value = Number(k.value);
      return isFinite(value) && !isNaN(value) ? amount + value : amount;
    }, 0);
    dispatch(setInsufficientAmountAlert(kitAmount < kitsCost));
  }, [configs, balances, dispatch])

  const handleSelectionType = (data: any) => {
    console.log('data: ', data);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleSort = (property: string) => (
    event: React.MouseEvent<unknown>,
  ) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const classes = useStyles();
  const onEditConfig = (slug: string) => {
    history.push(`/my-apps/wizard/marketplace/${slug}`);
  }

  const onOpenApp = (slug: string, type: WhitelabelTypes) => {
    switch (type) {
      case 'DEX':
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`) 
        break;
      case 'MARKETPLACE':
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`) 
        break;
      case 'AGGREGATOR':
        window.open(`https://swap.dexkit.com/#/swap?id=${slug}`) 
        break;
      default:
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`) 
        break;
    }
  }

  const onDeleteApp = (slug: string, type: WhitelabelTypes) => {
    const index = configs?.findIndex( c => c?.slug?.toLowerCase() === slug.toLowerCase() && 
      c?.type?.toLowerCase() === type.toLowerCase()) ?? -1;
    if(index >= 0){
      //TODO: chamar o end-point da API
      // const notification: Notification = {
        //   title: `${slug} app deleted`,
        //   body: `deleted ${slug} app successfully`,
        //   timestamp: (new Date()).getTime(),
        // };
        const config = configs?.splice(index, 1)[0];
        console.log('removed', config);
      const notification = new Notification(`${slug} app deleted`, { body: `deleted ${slug} app successfully` });
      dispatch(onAddNotification([notification]));
    }

  }

  return (
    <>
      {configs && configs.length > 0 ? (
        // <Box pt={{ xl: 4 }} clone>
        //   <GridContainer>
        //     <Grid item xs={12} md={12}>
        // <AppCard
        //   height={1}
        //   title={'My Apps'}
        //   action={
        //     <>
        //       <div>
        //         <IconButton aria-label="add">
        //           <AddIcon />
        //         </IconButton>

        //         <AppSelect
        //           menus={[
        //             'ALL',
        //             'Aggregators',
        //             'Exchanges',
        //             'NFT Marketplace',
        //           ]}
        //           defaultValue={'ALL'}
        //           onChange={handleSelectionType}
        //         />
        //       </div>
        //     </>
        //   }
        //   >
        <Paper className={classes.paper}>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h5'>My Apps</Typography>
          </Toolbar>

          <Box className={classes.tableResponsiveMaterial}>
            <Table stickyHeader>
              <TableHead>
                <TableRow className={classes.tableRowRoot}>
                  {headCells.map((h) => (
                    <TableCell
                      align={h.align}
                      className={classes.tableCellRoot}>
                      {h.isSort && (
                        <TableSortLabel
                          active={orderBy === h.id}
                          direction={orderBy === h.id ? orderDirection : 'asc'}
                          onClick={handleSort(h.id)}>
                          {h.label}
                        </TableSortLabel>
                      )}
                      {!h.isSort && h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(configs, getComparator(orderDirection, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((config, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component='th'
                        scope='row'
                        className={classes.tableCell}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '11rem',
                        }}>
                        <Box className={classes.anchar}>{config.slug}</Box>
                      </TableCell>
                      <TableCell align='left' className={classes.tableCell}>
                        {config.domain}
                      </TableCell>
                      <TableCell align='left' className={classes.tableCell}>
                        {config.type}
                      </TableCell>
                      <TableCell
                        component='th'
                        scope='row'
                        className={classes.tableCell}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '6rem',
                        }}>
                        <Box className={classes.anchar}>{config?.active}</Box>
                      </TableCell>
                      <TableCell align='left' className={classes.tableCell}>
                        <Box className={classes.badgeRoot}>
                            <IconButton aria-label="edit" onClick={() => onEditConfig(config.slug)}>
                              <EditIcon/>
                           </IconButton>
                           <IconButton aria-label="launch" onClick={() => onOpenApp(config.slug, config.type)}>
                              <LaunchIcon/>
                           </IconButton>
                           <IconButton 
                           aria-label="remove" 
                           onClick={($e) => {
                             $e.stopPropagation();
                             setShowDialog(true) 
                            //  onDeleteApp(config.slug, config.type)
                          }}>
                              <DeleteIcon/>
                           </IconButton>
                        </Box>
                      </TableCell>
                      <ConfirmationDialog 
                        title={`Want to confirm the exclusion of the "${config.slug}" app?`}
                        dialogTitle={'Confirm app exclusion'}
                        open={showDialog}
                        onConfirm={() => { 
                          onDeleteApp(config.slug, config.type)
                          setShowDialog(!showDialog);
                        }}
                        onDeny={(x) => setShowDialog(x)}
                      />
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            className={classes.paginationDesktop}
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
           <TablePagination
            className={classes.paginationMobile}
            rowsPerPageOptions={[]}
            component='div'
            count={data.length}
            rowsPerPage={25}
            page={page}
            onChangePage={handleChangePage}
          />

        </Paper>

      ) :
      <Paper className={classes.paper}>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h5'>My Apps</Typography>
          </Toolbar>
            <Grid
                  item
                  xs={12}
                  sm={12}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 0px',
                  }}>
                  <Typography>You don't have Apps yet </Typography>
              </Grid>
          </Paper>
      }

      {loading ? <Loader /> : null}

      {error ? JSON.stringify(error) : null}
    </>
  );
};

export default AppsTable;
