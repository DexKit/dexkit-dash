import React, { useCallback } from 'react';
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useLeaguesChainInfo } from "modules/CoinLeagues/hooks/useLeaguesChainInfo"
import { useHistory } from "react-router-dom";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { GET_CHAIN_ID_NAME } from "shared/constants/Blockchain";
import { ChainId } from "types/blockchain";
import { Tooltip } from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';



export const ChainSelect = () => {
    const { chainId } = useLeaguesChainInfo();
    const history = useHistory();
    const updateLeaguesChain = useCallback((e) => {
        const searchParams = new URLSearchParams(history.location.search);
        if (e.target.value === ChainId.Matic) {
            searchParams.set('network', EthereumNetwork.matic);
        }
        if (e.target.value === ChainId.Binance) {
            searchParams.set('network', EthereumNetwork.bsc);
        }

        history.push({ search: searchParams.toString() });

    }, [history])


    return (
        <Tooltip title={  <IntlMessages id='app.coinLeagues.chainSelected' values={{chainName: `${GET_CHAIN_ID_NAME(chainId)}`}}/>}>
        <FormControl>
            <Select
                variant='outlined'
                value={chainId}
                onChange={updateLeaguesChain}
                renderValue={(value) => <> {GET_CHAIN_ID_NAME(value as ChainId)}</>}>
                <MenuItem value={ChainId.Matic}>{GET_CHAIN_ID_NAME(ChainId.Matic)} </MenuItem>
                <MenuItem value={ChainId.Binance}>{GET_CHAIN_ID_NAME(ChainId.Binance)}</MenuItem>
            </Select>
        </FormControl>
        </Tooltip>)


}