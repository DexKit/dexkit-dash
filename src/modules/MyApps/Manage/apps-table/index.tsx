import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
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
  Button,
} from '@material-ui/core';

import {Loader} from '@crema';
import ConfirmationDialog from '@crema/core/ConfirmationDialog';

import {useStyles} from './index.style';

import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import {stableSort, getComparator} from 'utils/table';
import {useWeb3} from 'hooks/useWeb3';
import {setInsufficientAmountAlert} from 'redux/actions';
import {WhitelabelTypes} from 'types/myApps';
import {useBalance} from 'hooks/balance/useBalance';
import {useSetupDomainConfig} from 'modules/MyApps/hooks/useSetupDomainConfig';
import {DeployDomainDialog} from 'modules/MyApps/components/dialogs/DeployDomain';
import {useToggler} from 'hooks/useToggler';
import {StatusDomainDialog} from 'modules/MyApps/components/dialogs/StatusDomainDialog';
import {useMyAppsConfig} from 'modules/MyApps/hooks/useMyAppsConfig';
import {useDomainConfigStatusMutation} from 'modules/MyApps/hooks/useDomainConfigStatusMutation';
import CopyLink from 'shared/components/CopyLink';
import {DeleteAppDialog} from 'modules/MyApps/components/dialogs/DeleteApp';
import {useDeleteMyAppMutation} from 'modules/MyApps/hooks/useDeleteMyAppMutation';
import {SucceededDialog} from 'modules/MyApps/components/dialogs/SucceedDialog';
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
  {id: 'cname', align: 'left', label: 'CNAME', isSort: true},
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
  const [selectedDomain, setSelectedDomain] = useState<string>();
  const [selectedCname, setSelectedCname] = useState<string>();
  const [selectedConfig, setSelectedConfig] = useState<any>();
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const {account, chainId} = useWeb3();
  const {configs, loading, refetch} = useMyAppsConfig(account);
  const {onSendDomainConfigCallback, isError, isLoading, isDone} =
    useSetupDomainConfig();

  const domainStatusMutation = useDomainConfigStatusMutation();
  const deleteAppMutation = useDeleteMyAppMutation();
  const {data: balances} = useBalance();
  const history = useHistory();
  const dispatch = useDispatch();
  const deployDomainToggler = useToggler(false);
  const statusDomainToggler = useToggler(false);
  const succeededDomainToggler = useToggler(false);
  const deleteAppToggler = useToggler(false);

  useEffect(() => {
    const apps = configs?.filter((config) => config?.active) ?? [];
    const kitsCost = apps.reduce((cost, app) => {
      if (app.type === 'DEX') {
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_EXCHANGE);
      }
      if (app.type === 'AGGREGATOR') {
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_AGGREGATOR);
      }
      if (app.type === 'MARKETPLACE') {
        return cost + Number(process.env.REACT_APP_APP_COST_KIT_MARKETPLACE);
      }
      return cost;
    }, 0);
    const kitBalance =
      balances?.filter((b) => b?.currency?.symbol?.toUpperCase() === 'KIT') ??
      [];
    const kitAmount = kitBalance.reduce((amount, k) => {
      const value = Number(k.value);
      return isFinite(value) && !isNaN(value) ? amount + value : amount;
    }, 0);
    dispatch(setInsufficientAmountAlert(kitAmount < kitsCost));
  }, [configs, balances, dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleSort =
    (property: string) => (event: React.MouseEvent<unknown>) => {
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
    history.push(`/my-apps/wizard/aggregator/${slug}`);
  };

  const onOpenApp = (slug: string, type: WhitelabelTypes, domain?: string) => {
    if (domain) {
      window.open(`https://${domain}`);
      return;
    }

    switch (type) {
      case 'DEX':
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`);
        break;
      case 'MARKETPLACE':
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`);
        break;
      case 'AGGREGATOR':
        window.open(`https://swap.dexkit.com/#/swap?id=${slug}`);
        break;
      default:
        window.open(`https://exchange.dexkit.com/#/trade?id=${slug}`);
        break;
    }
  };

  const onDeleteApp = useCallback(
    (slug: string, type: WhitelabelTypes) => {
      const index =
        configs?.findIndex(
          (c) =>
            c?.slug?.toLowerCase() === slug.toLowerCase() &&
            c?.type?.toLowerCase() === type.toLowerCase(),
        ) ?? -1;
      if (index >= 0 && configs && account && chainId) {
        const config = configs[index];
        deleteAppToggler.toggle();
        deleteAppMutation.mutate({account, domain: config.domain, chainId});
      }
    },
    [configs, deleteAppToggler, deleteAppMutation, account, chainId],
  );

  const onDeployToDomainCallback = useCallback(
    (config: any) => {
      deployDomainToggler.toggle();
      setShowDeployDialog(false);
      onSendDomainConfigCallback(config, 'AGGREGATOR');
    },
    [onSendDomainConfigCallback, deployDomainToggler],
  );

  const onOpenValidateDomainModal = useCallback(
    (domain: string, cname: string) => {
      statusDomainToggler.toggle();
      setSelectedDomain(domain);
      setSelectedCname(cname);
    },
    [statusDomainToggler],
  );

  const onOpenSucceededModal = useCallback(
    (cname: string) => {
      succeededDomainToggler.toggle();
      setSelectedCname(cname);
    },
    [succeededDomainToggler],
  );

  const onValidateDomainCallback = useCallback(() => {
    if (selectedDomain) {
      domainStatusMutation.mutateAsync(selectedDomain).then(() => {
        refetch();
      });
    }
  }, [refetch, selectedDomain, domainStatusMutation]);
  const handleCloseSetupDomainDialog = useCallback(() => {
    deployDomainToggler.toggle();
  }, [deployDomainToggler]);

  const handleCloseStatusDomainDialog = useCallback(() => {
    statusDomainToggler.toggle();
    domainStatusMutation.reset();
  }, [statusDomainToggler, domainStatusMutation]);

  const handleCloseDeleteAppDialog = useCallback(() => {
    deleteAppToggler.toggle();
    deleteAppMutation.reset();
  }, [deleteAppToggler, deleteAppMutation]);

  const handleCloseSucceededDialog = useCallback(() => {
    succeededDomainToggler.toggle();
  }, [succeededDomainToggler]);

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
          <DeployDomainDialog
            done={isDone}
            loading={isLoading}
            error={isError}
            dialogProps={{
              open: deployDomainToggler.show,
              onClose: handleCloseSetupDomainDialog,
            }}
          />
          <StatusDomainDialog
            done={domainStatusMutation.isSuccess}
            loading={domainStatusMutation.isLoading}
            error={domainStatusMutation.isError}
            cname={selectedCname}
            onValidateDomain={onValidateDomainCallback}
            dialogProps={{
              open: statusDomainToggler.show,
              onClose: handleCloseStatusDomainDialog,
            }}
          />
          <DeleteAppDialog
            done={deleteAppMutation.isSuccess}
            loading={deleteAppMutation.isLoading}
            error={deleteAppMutation.isError}
            dialogProps={{
              open: deleteAppToggler.show,
              onClose: handleCloseDeleteAppDialog,
            }}
          />
          <SucceededDialog
            cname={selectedCname as string}
            dialogProps={{
              open: succeededDomainToggler.show,
              onClose: handleCloseSucceededDialog,
            }}
          />
          {selectedConfig && (
            <ConfirmationDialog
              title={`Want to confirm the exclusion of the "${selectedConfig?.slug}" app?`}
              dialogTitle={'Confirm app exclusion'}
              open={showDialog}
              onConfirm={() => {
                onDeleteApp(selectedConfig?.slug, selectedConfig?.type);
                setShowDialog(!showDialog);
              }}
              onDeny={(x) => setShowDialog(x)}
            />
          )}
          {selectedConfig && (
            <ConfirmationDialog
              title={`Deploy your app to your own domain, you will receive a CNAME to point to your app. Make sure to have 100 KIT on BSC, Polygon or Ethereum on your Fee Address to domain keep active.`}
              dialogTitle={'Deploy to your own domain?'}
              open={showDeployDialog}
              onConfirm={() => onDeployToDomainCallback(selectedConfig)}
              onDeny={(x) => setShowDeployDialog(x)}
            />
          )}

          <Toolbar className={classes.toolbar}>
            <Typography variant='h5'>My Apps</Typography>
          </Toolbar>

          <Box className={classes.tableResponsiveMaterial}>
            <Table stickyHeader>
              <TableHead>
                <TableRow className={classes.tableRowRoot}>
                  {headCells.map((h, k) => (
                    <TableCell
                      align={h.align}
                      className={classes.tableCellRoot}
                      key={k}>
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
                      <TableCell
                        align='left'
                        className={classes.tableCell}
                        style={{
                          width: '5rem',
                        }}>
                        {config?.cname && (
                          <CopyLink copyText={config?.cname} tooltip={'Copied'}>
                            {config?.cname}
                          </CopyLink>
                        )}

                        {!config.cname && (
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              setSelectedConfig(config);
                              setShowDeployDialog(true);
                            }}>
                            Deploy
                          </Button>
                        )}
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
                        {config?.domainStatus?.toUpperCase() ===
                          'SUCCEEDED' && (
                          <Button
                            variant='contained'
                            color='default'
                            onClick={() =>
                              onOpenSucceededModal(config?.cname as string)
                            }>
                            Succeeded
                          </Button>
                        )}
                        {config?.domainStatus?.toUpperCase() === 'PENDING' && (
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={() =>
                              onOpenValidateDomainModal(
                                config.domain as string,
                                config?.cname as string,
                              )
                            }>
                            Pending
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align='left' className={classes.tableCell}>
                        <Box className={classes.badgeRoot}>
                          <IconButton
                            aria-label='edit'
                            onClick={() => onEditConfig(config.slug)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='launch'
                            onClick={() =>
                              onOpenApp(
                                config.slug,
                                config.type,
                                config?.domain,
                              )
                            }>
                            <LaunchIcon />
                          </IconButton>
                          <IconButton
                            aria-label='remove'
                            onClick={($e) => {
                              $e.stopPropagation();
                              setSelectedConfig(config);
                              setShowDialog(true);
                              //  onDeleteApp(config.slug, config.type)
                            }}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
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
            onPageChange={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <TablePagination
            className={classes.paginationMobile}
            rowsPerPageOptions={[]}
            component='div'
            count={data.length}
            rowsPerPage={25}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      ) : (
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
      )}

      {loading ? <Loader /> : null}
    </>
  );
};

export default AppsTable;
