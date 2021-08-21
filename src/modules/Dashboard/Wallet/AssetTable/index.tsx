import React, {useState} from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import CTable from './CTable';
import {Chip, Fade, makeStyles, Paper} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import LoadingTable from 'modules/Common/LoadingTable';
import {MyBalances} from 'types/blockchain';
import {EthereumNetwork} from 'shared/constants/AppEnums';

interface AssetTableProps {
  balances: MyBalances[];
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

  const [filter, setFilter] = useState('all');

  const filteredBalances = () => {
    if (filter === 'eth') {
      return balances.filter((b) => b.network === EthereumNetwork.ethereum);
    }
    if (filter === 'bnb') {
      return balances.filter((b) => b.network === EthereumNetwork.bsc);
    }
    return balances;
  };

  return (
    <AppCard
      contentStyle={{paddingLeft: 0, paddingRight: 0}}
      title='My Assets'
      action={
        <div>
          <Chip
            style={{marginRight: 10}}
            label='All'
            clickable
            color={filter === 'all' ? 'primary' : 'default'}
            onClick={() => setFilter('all')}
          />
          <Chip
            style={{marginRight: 10}}
            label='ETH'
            clickable
            color={filter === 'eth' ? 'primary' : 'default'}
            onClick={() => setFilter('eth')}
          />
          <Chip
            label='BSC'
            clickable
            color={filter === 'bnb' ? 'primary' : 'default'}
            onClick={() => setFilter('bnb')}
          />
        </div>
      }>
      <Fade in={true} timeout={1000}>
        <Paper className={classes.paper}>
          {loading ? (
            <LoadingTable columns={3} rows={3} />
          ) : (
            <CTable balances={filteredBalances()} />
          )}
        </Paper>
      </Fade>
    </AppCard>
  );
};

export default AssetTable;
