import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useWeb3} from 'hooks/useWeb3';
import CTable from './CTable';
import Box from '@material-ui/core/Box';
import {getTokenInfo} from 'services/graphql/bitquery';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {Token} from 'types/app';
import AppCard from '@crema/core/AppCard';
import {makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  address: string;
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

const TokenInfo: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<Token>();

  useEffect(() => {
    setTableData(undefined);
    getTokenInfo(GET_NETWORK_NAME(chainId), props.address)
      .then((data) => setTableData(data))
      .catch((e) => console.log(e));
  }, [props.address]);

  const classes = useStyles();

  return (
    // <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
    //   <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['title.tokenInfo']}>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h5'>{messages['title.tokenInfo']}</Typography>
      </Toolbar>
      <CTable data={tableData} />
    </Paper>
  );
};

export default TokenInfo;
