import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useWeb3} from 'hooks/useWeb3';
import CTable from './CTable';
import Box from '@material-ui/core/Box';
import {getTokenPairs} from 'services/graphql/bitquery';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {TokenPair} from 'types/app';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import AppCard from '@crema/core/AppCard';
import {makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
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

const TokenPairs: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<TokenPair[]>([]);

  useEffect(() => {
    setTableData([]);
    getTokenPairs(GET_NETWORK_NAME(chainId), props.exchange, props.address)
      .then((orders) => setTableData(orders))
      .catch((e) => console.log(e));
  }, [props.address]);

  const classes = useStyles();

  return (
    // <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
    //   <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['app.topPairs']}>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h5'>{messages['app.topPairs']}</Typography>
      </Toolbar>
      <CTable
        data={tableData}
        exchange={props.exchange}
        networkName={props.networkName}
      />
    </Paper>
    //   </AppCard>
    // </Box>
  );
};

export default TokenPairs;
