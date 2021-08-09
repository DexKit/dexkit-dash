import {useEffect, useState} from 'react';
import {useChainId} from '../useChainId';
import usePagination from 'hooks/usePagination';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME, GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {
  BITQUERY_CONTRACT_EVENT_BY_HASH,
  BITQUERY_MINT_BURN,
} from 'services/graphql/bitquery/protocol/amm.gql';
import {client} from 'services/graphql';
import {MintBurn} from 'types/app';
import {
  GetMintBurn,
  GetMintBurnVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetMintBurn';
import {
  GetAMMPairExplorer_ethereum_dexTrades_baseCurrency,
  GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency,
} from 'services/graphql/bitquery/protocol/__generated__/GetAMMPairExplorer';
import {
  GetContractEventByHash,
  GetContractEventByHashVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetContractEventByHash';
import {toTokenUnitAmount} from '@0x/utils';

interface Props {
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
  baseCurrency: GetAMMPairExplorer_ethereum_dexTrades_baseCurrency;
  quoteCurrency: GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency;
}
export const useAMMPoolHistory = ({
  networkName,
  exchange,
  address,
  baseCurrency,
  quoteCurrency,
}: Props) => {
  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<MintBurn[]>();

  const parseMintBurnData = (
    data: GetMintBurn | undefined,
  ): {mint: MintBurn[]; burn: MintBurn[]} => {
    if (data && data.ethereum) {
      const mint: MintBurn[] =
        data.ethereum.mint?.map((e: any) => {
          return {
            hash: e.transaction.hash,
            block: e.block.height,
            type: 'Add',
            time: e.block.timestamp.time,
            amount0: 0,
            amount1: 0,
            reserve0: 0,
            reserve1: 0,
            variation: 0,
            baseCurrency: baseCurrency,
            quoteCurrency: quoteCurrency,
          };
        }) || [];

      const burn: MintBurn[] =
        data.ethereum.burn?.map((e: any) => {
          return {
            hash: e.transaction.hash,
            block: e.block.height,
            type: 'Remove',
            time: e.block.timestamp.time,
            amount0: 0,
            amount1: 0,
            reserve0: 0,
            reserve1: 0,
            variation: 0,
            baseCurrency: baseCurrency,
            quoteCurrency: quoteCurrency,
          };
        }) || [];

      return {mint, burn};
    } else {
      return {mint: [], burn: []};
    }
  };

  const getVariation = (isAdd: boolean, amount: number, reserve: number) => {
    return isAdd
      ? (100 * reserve) / (reserve - amount) - 100
      : (100 * reserve) / (reserve + amount) - 100;
  };

  const parseEventContractData = (
    data: GetContractEventByHash,
    mint: MintBurn[],
    burn: MintBurn[],
  ) => {
    if (data && data.ethereum?.smartContractEvents) {
      const events = data.ethereum?.smartContractEvents;

      const mintEvents: any[] =
        events.filter((e: any) => e.smartContractEvent.name === 'Mint')[0]
          .arguments || [];
      const burnEvents: any[] =
        events.filter((e: any) => e.smartContractEvent.name === 'Burn')[0]
          .arguments || [];
      const reserveEvents: any[] =
        events.filter((e: any) => e.smartContractEvent.name === 'Sync')[0]
          .arguments || [];

      mint.map((e, index) => {
        e.amount0 = toTokenUnitAmount(
          mintEvents[index * 3 + 1].value,
          baseCurrency.decimals,
        ).toNumber();
        e.amount1 = toTokenUnitAmount(
          mintEvents[index * 3 + 2].value,
          quoteCurrency.decimals,
        ).toNumber();
        return e;
      });

      burn.map((e, index) => {
        e.amount0 = toTokenUnitAmount(
          burnEvents[index * 4 + 1].value,
          baseCurrency.decimals,
        ).toNumber();
        e.amount1 = toTokenUnitAmount(
          burnEvents[index * 4 + 2].value,
          quoteCurrency.decimals,
        ).toNumber();
        return e;
      });

      const all = mint.concat(burn).map((e, index) => {
        e.reserve0 = toTokenUnitAmount(
          reserveEvents[index * 2].value,
          baseCurrency.decimals,
        ).toNumber();
        e.reserve1 = toTokenUnitAmount(
          reserveEvents[index * 2 + 1].value,
          quoteCurrency.decimals,
        ).toNumber();
        e.variation = getVariation(e.type == 'Add', e.amount0, e.reserve0);
        return e;
      });

      return all.sort((a, b) => b.block - a.block);
    }

    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const dataMintBurn = await client.query<
        GetMintBurn,
        GetMintBurnVariables
      >({
        query: BITQUERY_MINT_BURN,
        variables: {
          network: networkName,
          address: address,
          limit: rowsPerPage / 2,
          offset: skipRows / 2,
        },
      });

      const dataMintBurnFn = parseMintBurnData(dataMintBurn.data);
      const hashs = dataMintBurnFn.burn
        .concat(dataMintBurnFn.mint)
        .map((e) => e.hash);

      const contractEvent = await client.query<
        GetContractEventByHash,
        GetContractEventByHashVariables
      >({
        query: BITQUERY_CONTRACT_EVENT_BY_HASH,
        variables: {
          network: networkName,
          address: address,
          hash: hashs,
        },
      });

      const newData = parseEventContractData(
        contractEvent.data,
        dataMintBurnFn.mint,
        dataMintBurnFn.burn,
      );

      setData(newData);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exchange && address) {
      fetchData();
    }
  }, [exchange, address, rowsPerPage, skipRows]);

  return {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  };
};
