import React, {useEffect, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import {Box, makeStyles} from '@material-ui/core';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';

import {CremaTheme} from '../../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';
import {useTokenList} from 'hooks/useTokenList';
import MarketForm from './MarketForm';
import OrderDialog from './Modal';
import BigNumber from 'bignumber.js';
// import {Token} from 'types/app';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {Token} from 'types/app';

interface Props {
  tokenAddress: string;
  balances: GetMyBalance_ethereum_address_balances[];
  // actionButton: ($event?: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const BuySell: React.FC<Props> = ({tokenAddress, balances}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    muiTabsRoot: {
      position: 'relative',
      marginTop: -8,
      marginLeft: -8,
      marginBottom: 16,
      [theme.breakpoints.up('xl')]: {
        marginLeft: -20,
        marginBottom: 32,
      },
      '& .Mui-selected': {
        fontFamily: Fonts.LIGHT,
      },
    },
    muiTab: {
      fontSize: 16,
      textTransform: 'capitalize',
      padding: 0,
      marginLeft: 8,
      marginRight: 8,
      fontWeight: 'bold',
      minWidth: 10,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        marginLeft: 20,
        marginRight: 20,
      },
    },
  }));

  const classes = useStyles();

  const {chainId, account} = useWeb3();

  const [select0, setSelect0] = useState<Token[]>([]);

  const select1 = useTokenList();

  const [currentTab, setCurrentTab] = useState(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [modalData, setModalData] = useState<ModalOrderData>({
    account: '',
    allowanceTarget: '',
    amount: new BigNumber(0),
    isMarket: true,
    price: 0,
    token0: {address: '', name: '', symbol: '', decimals: 18},
    token1: {address: '', name: '', symbol: '', decimals: 18},
  });

  useEffect(() => {
    setSelect0(
      balances.map((e) => {
        return {
          name: e.currency?.name || '',
          symbol: e.currency?.symbol || '',
          address: e.currency?.address || '',
          decimals: e.currency?.decimals || 18,
        } as Token;
      }),
    );
  }, [balances]);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleTradeOpen = (data: ModalOrderData) => {
    setModalData(data);
    setModalOpen(true);
  };

  const handleTradeClose = () => {
    setModalOpen(false);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        height='1'
        clone>
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            indicatorColor='primary'
            textColor='primary'
            className={classes.muiTabsRoot}>
            <Tab
              className={classes.muiTab}
              label={<IntlMessages id='Market' />}
              {...a11yProps(0)}
            />
            {/* <Tab className={classes.muiTab} label={<IntlMessages id='Limit' />} {...a11yProps(1)} /> */}
          </Tabs>
          {currentTab === 0 && (
            <MarketForm
              key='MarketForm'
              chainId={chainId}
              account={account}
              tokenAddress={tokenAddress}
              balances={balances}
              select0={select0}
              select1={select1}
              actionButton={handleTradeOpen}
            />
          )}
          {/* {
            value === 1 && <LimitForm
            key="LimitForm(1)"
            tokens={configFile?.tokens ?? []} 
            chainId={(new BigNumber(chainId ?? 1)).toNumber()}
            actionButton={props.actionButton}
            />
          } */}
        </Card>
      </Box>

      {account && (
        <OrderDialog
          open={modalOpen}
          isMarket={modalData.isMarket}
          amount={modalData.amount}
          token0={modalData.token0}
          token1={modalData.token1}
          account={account}
          allowanceTarget={modalData.allowanceTarget}
          price={modalData.price}
          onClose={handleTradeClose}
        />
      )}
    </>
  );
};

export default BuySell;
