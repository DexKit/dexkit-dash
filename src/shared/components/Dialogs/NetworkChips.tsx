import React from 'react';
import Box from "@material-ui/core/Box"
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { ChainId } from 'types/blockchain';
import { useCustomNetworkList } from 'hooks/network';

interface Props{
    onSetChainId: (chainId?: ChainId) => void
    selectedChainId?: ChainId
  
  }

export const NetworkChips = (props: Props) => {
    const {onSetChainId, selectedChainId} = props
    const { networks } = useCustomNetworkList() ;
    return <Box px={4} py={4}>
        <Grid container spacing={2}>
            <Grid item>
                <Chip
                    size='small'
                    label='All'
                    variant={selectedChainId === undefined ? 'default' : 'outlined'}
                    onClick={() => onSetChainId(undefined)}
                />
            </Grid>
            <Grid item>
                <Chip
                    size='small'
                    label='ETH'
                    onClick={() => onSetChainId(ChainId.Mainnet)}
                    variant={
                        selectedChainId === ChainId.Mainnet ? 'default' : 'outlined'
                    }
                />
            </Grid>
            <Grid item>
                <Chip
                    size='small'
                    label='BSC'
                    onClick={() => onSetChainId(ChainId.Binance)}
                    variant={
                        selectedChainId === ChainId.Binance ? 'default' : 'outlined'
                    }
                />
            </Grid>
            <Grid item>
                <Chip
                    size='small'
                    label='Matic'
                    onClick={() => onSetChainId(ChainId.Matic)}
                    variant={
                        selectedChainId === ChainId.Matic ? 'default' : 'outlined'
                    }
                />
            </Grid>
            {networks.map((net) =>
                <Grid item>
                    <Chip
                        size='small'
                        label={net.name}
                        onClick={() => onSetChainId(net.chainId)}
                        variant={
                            selectedChainId === net.chainId ? 'default' : 'outlined'
                        }
                    />
                </Grid>)}


        </Grid>
    </Box>
}