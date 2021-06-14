import React, {useEffect, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import {Box, Fade, makeStyles} from '@material-ui/core';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {EthereumNetwork, Fonts} from '../../../../shared/constants/AppEnums';

import {CremaTheme} from '../../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';
import {useTokenList} from 'hooks/useTokenList';
import MarketForm from './MarketForm';
import OrderDialog from './Modal';
// import {Token} from 'types/app';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {Token} from 'types/app';
import LimitForm from './LimitForm';
import {
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {MyBalances, Web3State} from 'types/blockchain';
import { isNativeCoinWithoutChainId } from 'utils';
import { useHistory } from 'react-router-dom';
import { useDefaultAccount } from 'hooks/useDefaultAccount';

interface Props {
  tokenAddress: string;
  networkName: EthereumNetwork;
  balances: MyBalances[];
  // actionButton: ($event?: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const BuySell: React.FC<Props> = ({tokenAddress, balances, networkName}) => {
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
      width: '50%',
      minWidth: 10,
      maxWidth: 100,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        marginLeft: 20,
        marginRight: 20,
      },
    },
  }));

  let history = useHistory();

  const classes = useStyles();

  const {chainId, account: web3Account, web3State} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const [select0, setSelect0] = useState<Token[]>([]);

  const select1 = useTokenList(networkName);

  const [tokenFrom, setTokenFrom] = useState<Token>();

  const [tokenTo, setTokenTo] = useState<Token>();

  const [currentTab, setCurrentTab] = useState(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [modalData, setModalData] = useState<ModalOrderData>({
    isMarket: true,
    account: '',
    allowanceTarget: '',
    tokenFrom: {address: '', name: '', symbol: '', decimals: 18},
    tokenTo: {address: '', name: '', symbol: '', decimals: 18},
    amountFrom: 0,
    amountTo: 0,
    price: 0,
    expiry: 0,
  });

  useEffect(() => {
    if (select1 && balances) {
      const balancesFn = balances.map((e) => {
        return {
          name: e.currency?.name || '',
          symbol: e.currency?.symbol || '',
          address: e.currency?.address || '',
          decimals: e.currency?.decimals || 18,
          networkName: e.network,
        } as Token;
      });

      setSelect0(balancesFn);

      if (tokenTo === undefined) {
        let _token;
        if (isNativeCoinWithoutChainId(tokenAddress)) {
          _token = select1.find(
            (t) => t.symbol.toLowerCase() === tokenAddress.toLowerCase(),
          );
        } else {
          _token = select1.find(
            (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
          );
        }
        setTokenTo(_token);
        console.log('setTokenTo', _token);
      }
    }
  }, [select1, balances]);

  useEffect(() => {
    if (tokenFrom === undefined) {
      const _token = select0.find(
        (t) =>
          t.symbol.toUpperCase() ===
            GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase() ||
          t.symbol.toUpperCase() ===
            GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(
              networkName,
            ).toUpperCase(),
      );
      setTokenFrom(_token);
      console.log('setTokenFrom', _token);
    }
  }, [select0]);

  const handleChangeToken = (token: Token | undefined, type: 'from' | 'to') => {
    if (token) {
      if (type === 'from') {
        if (
          tokenTo &&
          token.address.toLowerCase() === tokenTo.address.toLowerCase()
        ) {
          const aux = tokenFrom;
          setTokenFrom(tokenTo);
          setTokenTo(aux);

          history.push(token.address);
        } else {
          if (token.networkName && token.networkName !== networkName) {
            history.push(
              `/${token.networkName}/dashboard/token/${token.address}`,
            );
          }
          setTokenFrom(token);
        }
      } else {
        if (
          tokenFrom &&
          token.address.toLowerCase() === tokenFrom.address.toLowerCase()
        ) {
          if (web3State === Web3State.Done) {
            const availableTokenFrom = select0.find(
              (e) => e.address.toLowerCase() === tokenTo?.address.toLowerCase(),
            );

            if (availableTokenFrom) {
              const aux = tokenTo;
              setTokenTo(tokenFrom);
              setTokenFrom(aux);
            } else {
              const newTokenFrom = select0.find(
                (e) => e.address.toLowerCase() !== token.address.toLowerCase(),
              );

              setTokenTo(tokenFrom);
              setTokenFrom(newTokenFrom);
            }
          } else {
            const aux = tokenTo;
            setTokenTo(tokenFrom);
            setTokenFrom(aux);
          }
        } else {
          setTokenTo(token);
        }

        history.push(token.address);
      }
    }
  };

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
      <Fade in={true} timeout={1000}>
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
              <Tab
                className={classes.muiTab}
                label={<IntlMessages id='Limit' />}
                {...a11yProps(1)}
              />
            </Tabs>

            {currentTab === 0 && (
              <MarketForm
                key='MarketForm'
                chainId={chainId}
                account={account}
                tokenAddress={tokenAddress}
                networkName={networkName}
                balances={balances}
                select0={select0}
                select1={select1}
                tokenFrom={tokenFrom}
                tokenTo={tokenTo}
                onChangeToken={handleChangeToken}
                onTrade={handleTradeOpen}
              />
            )}

            {currentTab === 1 && (
              <LimitForm
                key='LimitForm'
                chainId={chainId}
                account={account}
                tokenAddress={tokenAddress}
                networkName={networkName}
                balances={balances}
                select0={select0}
                select1={select1}
                tokenFrom={tokenFrom}
                tokenTo={tokenTo}
                onChangeToken={handleChangeToken}
                onTrade={handleTradeOpen}
              />
            )}
          </Card>
        </Box>
      </Fade>

      {account && (
        <OrderDialog
          open={modalOpen}
          networkName={networkName}
          isMarket={modalData.isMarket}
          balances={balances}
          account={account}
          allowanceTarget={modalData.allowanceTarget}
          tokenFrom={modalData.tokenFrom}
          tokenTo={modalData.tokenTo}
          amountFrom={modalData.amountFrom}
          amountTo={modalData.amountTo}
          price={modalData.price}
          expiry={modalData.expiry}
          onClose={handleTradeClose}
        />
      )}
    </>
  );
};

export default BuySell;
