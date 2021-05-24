import { useChainId } from "../useChainId";
import { useQuery } from "@apollo/client";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { BITQUERY_TRANSACTION_LIST } from "services/graphql/bitquery/history/gql";
import { GetTransactionList, GetTransactionListVariables, GetTransactionList_ethereum_sender, GetTransactionList_ethereum_sender_block, GetTransactionList_ethereum_sender_currency, GetTransactionList_ethereum_sender_receiver, GetTransactionList_ethereum_sender_sender, GetTransactionList_ethereum_sender_transaction } from "services/graphql/bitquery/history/__generated__/GetTransactionList";
import usePagination from "hooks/usePagination";
import { useEffect, useState } from "react";
import { ITransactionList } from "types/app";

interface Props {
  address: string
}

export const useTransactionList = ({address}: Props) =>{

  const { currentChainId } = useChainId();

  const { currentPage, rowsPerPage, rowsPerPageOptions, skipRows, onChangePage, onChangePerPage } = usePagination();

  const [data, setData] = useState<ITransactionList[]>();

  const { loading, error, data: dataFn } = useQuery<GetTransactionList, GetTransactionListVariables>(BITQUERY_TRANSACTION_LIST, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      address: address,
      limit: rowsPerPage,
      offset: skipRows
    },
    pollInterval: POLL_INTERVAL
  });
 
  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.receiver && dataFn?.ethereum?.sender) {
      const sender: any[] = dataFn.ethereum.sender.map((e: any) => {return {...e, type:'Send'}});
      const receiver: any[] = dataFn.ethereum.receiver.map((e: any) => {return {...e, type:'Receive'}});

      setData(sender.concat(receiver as any).sort((a, b) => (b?.block?.height||0) - (a?.block?.height||0)));
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

  return { loading, error, data, currentPage, rowsPerPage, rowsPerPageOptions, onChangePage, onChangePerPage };
}