import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3 } from 'hooks/useWeb3';
import CTable from './CTable';
import Box from '@material-ui/core/Box';
import { getTokenStatistics } from 'services/graphql/bitquery';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import AppCard from '@crema/core/AppCard';
import { TokenStatistic } from 'types/app';

interface Props {
  address: string
}

const TokenStatistics: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<TokenStatistic>();
 
  useEffect(() => {
    setTableData(undefined);
    getTokenStatistics(GET_NETWORK_NAME(chainId), props.address, null, null)
      .then(data => setTableData(data))
      .catch(e => console.log(e))
  }, [props.address]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['title.tokenStatistics']}>
        <CTable data={tableData} />
      </AppCard>
    </Box>
  );
};

export default TokenStatistics;
