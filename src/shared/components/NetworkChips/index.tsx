import {Chip, Grid} from '@material-ui/core';
import React, {useState} from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';

type Network = EthereumNetwork | 'all';

interface Props {
  networkName: Network;
  enableAll: boolean;
  onClick: (network: Network) => any;
  style?: any;
}

const NetworkChips = (props: Props) => {
  const {enableAll, networkName, onClick} = props;

  const [filter, setFilter] = useState<Network>(networkName);
  const onClickChip = (net: Network) => {
    setFilter(net);
    onClick(net);
  };

  return (
    <Grid container alignItems='center' justify='flex-start' direction='row'>
      {enableAll && (
        <Chip
          style={{marginRight: 10}}
          label='All'
          clickable
          variant={filter === 'all' ? 'default' : 'outlined'}
          onClick={() => onClickChip('all')}
        />
      )}
      <Chip
        style={{marginRight: 10}}
        label='ETH'
        clickable
        variant={filter === EthereumNetwork.ethereum ? 'default' : 'outlined'}
        onClick={() => onClickChip(EthereumNetwork.ethereum)}
      />
      <Chip
        label='BSC'
        clickable
        variant={filter === EthereumNetwork.bsc ? 'default' : 'outlined'}
        onClick={() => onClickChip(EthereumNetwork.bsc)}
      />
       <Chip
        label='MATIC'
        clickable
        variant={filter === EthereumNetwork.matic ? 'default' : 'outlined'}
        onClick={() => onClickChip(EthereumNetwork.matic)}
      />
    </Grid>
  );
};

export default NetworkChips;
