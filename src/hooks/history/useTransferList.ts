import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import usePagination from 'hooks/usePagination';
import {BITQUERY_TRANSFER_LIST} from 'services/graphql/bitquery/history/gql';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {
  GetTransferList,
  GetTransferListVariables,
  GetTransferList_ethereum_transfers,
} from 'services/graphql/bitquery/history/__generated__/GetTransferList';
import {Transfers} from 'types/app';

interface Props {
  address: string;
  networkName: EthereumNetwork;
}

export const useTransferList = ({address, networkName}: Props) => {
  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<Transfers[]>();

  const {loading, error, data: dataFn} = useQuery<
    GetTransferList,
    GetTransferListVariables
  >(BITQUERY_TRANSFER_LIST, {
    variables: {
      network: networkName,
      address: address,
      limit: Math.floor(rowsPerPage),
      offset: Math.floor(skipRows),
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (
      dataFn &&
      dataFn?.ethereum?.transfers &&
      dataFn?.ethereum?.transfers.length
    ) {
      const transfers: Transfers[] = dataFn.ethereum.transfers.map(
        (e: GetTransferList_ethereum_transfers) => {
          if (e.receiver?.address.toLowerCase() === address.toLowerCase()) {
            return {...e, type: 'Receive'};
          }
          return {...e, type: 'Send'};
        },
      );

      setData(transfers);
    }
  }, [dataFn]);

  // const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
  //   setFilterValue(event.target.value as FilterEvent);

  //   if (event.target.value === 'all') {
  //     setTableData(data);
  //   }
  //   else if (event.target.value === 'send') {
  //     setTableData(data.filter((data: TransferByAddress) => data.type === 'Send'));
  //   }
  //   else {
  //     setTableData(data.filter((data: TransferByAddress) => data.type === 'Receive'));
  //   }
  // };

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
