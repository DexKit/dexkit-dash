import React from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import CTable from './CTable';
import {makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import { GetMyBalance_ethereum_address_balances } from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

interface AssetTableProps {
  balances: GetMyBalance_ethereum_address_balances[];
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

const AssetTable: React.FC<AssetTableProps> = ({balances}) => {
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
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h5'>My Assets</Typography>
      </Toolbar>
      <CTable balances={balances} />
    </Paper>
  );
};

export default AssetTable;
