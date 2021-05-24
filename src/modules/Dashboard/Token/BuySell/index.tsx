import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
import {Token} from 'types/app';
import {useBalance} from 'hooks/balance/useBalance';
import {ModalOrderData} from 'types/models/ModalOrderData';

interface Props {
  tokenAddress: string;
  // actionButton: ($event?: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const BuySell: React.FC<Props> = ({tokenAddress}) => {
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

  // const { data: select0 } = useBalance()

  const selects = useTokenList();

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
              account={account}
              tokenAddress={tokenAddress}
              select0={selects}
              select1={selects}
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
