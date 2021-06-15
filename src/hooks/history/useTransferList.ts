import { useChainId } from "../useChainId";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { BITQUERY_TRANSACTION_LIST } from "services/graphql/bitquery/history/gql";
import { GetTransactionList, GetTransactionListVariables } from "services/graphql/bitquery/history/__generated__/GetTransactionList";
import usePagination from "hooks/usePagination";
import { ITransactionList } from "types/app";
import { EthereumNetwork } from "../../../__generated__/globalTypes";

interface Props {
  address: string,
  networkName: EthereumNetwork;
}

export const useTransferList = ({address, networkName}: Props) =>{

  const { currentChainId } = useChainId();

  const { currentPage, rowsPerPage, skipRows, rowsPerPageOptions, onChangePage, onChangeRowsPerPage } = usePagination();

  const [data, setData] = useState<ITransactionList[]>();

  const { loading, error, data: dataFn } = useQuery<GetTransactionList, GetTransactionListVariables>(BITQUERY_TRANSACTION_LIST, {
    variables: {
      network: networkName,
      address: address,
      limit: Math.floor(rowsPerPage/2),
      offset: Math.floor(skipRows/2)
    },
    pollInterval: POLL_INTERVAL
  });
 
  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.receiver && dataFn?.ethereum?.sender) {
      const sender: any[] = dataFn.ethereum.sender.map((e: any) => {return {...e, type:'Send'}});
      const receiver: any[] = dataFn.ethereum.receiver.map((e: any) => {return {...e, type:'Receive'}});

      setData((sender.concat(receiver as any).sort((a, b) => (b?.block?.height||0) - (a?.block?.height||0))));
    }
  }, [dataFn])

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

  return { loading, error, data, currentPage, rowsPerPage, rowsPerPageOptions, onChangePage, onChangeRowsPerPage };
}