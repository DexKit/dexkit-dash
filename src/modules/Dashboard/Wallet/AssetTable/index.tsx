import React from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import CTable from './CTable';
import {Fade, makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import LoadingTable from 'modules/Common/LoadingTable';

interface AssetTableProps {
  balances: GetMyBalance_ethereum_address_balances[];
  loading?: boolean;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const AssetTable: React.FC<AssetTableProps> = ({balances, loading}) => {
  const classes = useStyles();

  return (
    // <AppCard
    //   contentStyle={{paddingLeft: 0, paddingRight: 0,}}
    //   title="My Assets"
    //   action={
    //     <>
    //     {/* <div>
    //       <Chip style={{marginRight: 10}} label="All" clickable color="primary" />
    //       <Chip style={{marginRight: 10}} label="Coins" clickable />
    //       <Chip label="Token" clickable />
    //     </div> */}

    //     {/* <Button style={{textTransform: 'none'}} color="secondary">
    //       View All
    //     </Button> */}
    //     </>
    //   }>
    //  </AppCard>
    <Fade in={true} timeout={1000}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h5'>My Assets</Typography>
        </Toolbar>
        {loading ? (
          <LoadingTable columns={3} rows={3} />
        ) : (
          <CTable balances={balances} />
        )}
      </Paper>
    </Fade>
  );
};

export default AssetTable;
