import React, {useEffect, useState} from 'react';

import {Tab, Tabs, Box, makeStyles} from '@material-ui/core';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {EthereumNetwork, Fonts} from '../../../../shared/constants/AppEnums';

import {CremaTheme} from '../../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';
import {useTokenList} from 'hooks/useTokenList';
import MarketForm from './MarketForm';
import OrderDialog from './Modal';
import {ModalOrderData} from 'types/models/ModalOrderData';
import {Token} from 'types/app';
import LimitForm from './LimitForm';
import {
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {MyBalances, Web3State} from 'types/blockchain';
import {isNativeCoinWithoutChainId} from 'utils';
import {useHistory} from 'react-router-dom';
import {
  ETH_SYMBOL_URL,
  BINANCE_SYMBOL_URL,
  MATIC_SYMBOL_URL,
} from 'shared/constants/Coins';

interface Props {
  disableReceive?: boolean;
  tokenAddress?: string;
  networkName: EthereumNetwork;
  balances: MyBalances[];
  tokenInfo?: Token;
  // actionButton: ($event?: React.SyntheticEvent<HTMLElement, Event>) => void;
}

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
  tabsContainer: {
    width: '100%',
  },
}));

//TODO: This select1 and select0 logic is bugged and it is not working well, investigate way to change all this logic
const BuySell: React.FC<Props> = ({
  tokenAddress,
  balances,
  networkName,
  tokenInfo,
  disableReceive,
}) => {
  const history = useHistory();

  const classes = useStyles();

  const {chainId, account, web3State} = useWeb3();

  const [select0, setSelect0] = useState<Token[]>([]);
  const [select1, setSelect1] = useState<Token[]>([]);

  const tokensETH = useTokenList(EthereumNetwork.ethereum);
  const tokensBSC = useTokenList(EthereumNetwork.bsc);
  const tokensMATIC = useTokenList(EthereumNetwork.matic);
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
    if (networkName === EthereumNetwork.bsc) {
      setSelect1(tokensBSC);
    } else if (networkName === EthereumNetwork.matic) {
      setSelect1(tokensMATIC);
    } else {
      setSelect1(tokensETH);
    }
  }, [networkName, tokensETH, tokensBSC, tokensMATIC]);

  // Here, we map the balances with logos from the token lists
  useEffect(() => {
    if (balances) {
      const balancesFn = balances.map((e) => {
        // Fetch image from balances first, if not take it from list
        let tokenLogoUri = e.logoURI;
        // Add images from token list
        if (
          e.network === EthereumNetwork.ethereum &&
          tokensETH.length > 0 &&
          !tokenLogoUri
        ) {
          if (e?.currency?.symbol.toLowerCase() === 'eth') {
            tokenLogoUri = ETH_SYMBOL_URL;
          } else {
            const token = tokensETH.find(
              (t: any) =>
                t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
            );
            if (token) {
              tokenLogoUri = token.logoURI;
            }
          }
        }
        if (
          e.network === EthereumNetwork.bsc &&
          tokensBSC.length > 0 &&
          !tokenLogoUri
        ) {
          if (e?.currency?.symbol.toLowerCase() === 'bnb') {
            tokenLogoUri = BINANCE_SYMBOL_URL;
          } else {
            const token = tokensBSC.find(
              (t: any) =>
                t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
            );
            if (token) {
              tokenLogoUri = token.logoURI;
            }
          }
        }

        if (
          e.network === EthereumNetwork.matic &&
          tokensMATIC.length > 0 &&
          !tokenLogoUri
        ) {
          if (e?.currency?.symbol.toLowerCase() === 'matic') {
            tokenLogoUri = MATIC_SYMBOL_URL;
          } else {
            const token = tokensMATIC.find(
              (t: any) =>
                t.address.toLowerCase() === e.currency?.address?.toLowerCase(),
            );
            if (token) {
              tokenLogoUri = token.logoURI;
            }
          }
        }
        return {
          name: e.currency?.name || '',
          symbol: e.currency?.symbol || '',
          address: e.currency?.address || '',
          decimals: e.currency?.decimals || 18,
          networkName: e.network,
          logoURI: tokenLogoUri,
        } as Token;
      });
      setSelect0(balancesFn);
    }
  }, [balances, tokensETH, tokensBSC, tokensMATIC]);
  // We fill the tokenTo field with the selected token on the url
  useEffect(() => {
    if (tokenTo === undefined && select1.length > 0 && tokenAddress) {
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
      if (_token) {
        setTokenTo(_token);
        return;
      }
      // If token not known
      if (tokenInfo) {
        _token = select1.find(
          (t) => t.address.toLowerCase() === tokenInfo.address.toLowerCase(),
        );
        // If token is not available on normal list, add it
        if (!_token) {
          setSelect1(select1.concat(tokenInfo));
          setTokenTo(tokenInfo);
        }
      }
    }
  }, [select1, tokenInfo, tokenTo, tokenInfo]);
  // We here auto fill the from select with a default value if not set. We start with native coin,
  // then wrapped and then the first one on the list
  useEffect(() => {
    if (tokenFrom === undefined && select0.length > 0) {
      const _token = select0.find(
        (t) =>
          t.symbol.toUpperCase() ===
          GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase(),
      );
      if (
        _token &&
        _token.symbol.toLowerCase() !== tokenInfo?.symbol.toLowerCase()
      ) {
        setTokenFrom(_token);
      } else {
        const _token = select0.find(
          (t) =>
            t.symbol.toUpperCase() ===
            GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(
              networkName,
            ).toUpperCase(),
        );
        if (
          _token &&
          _token.symbol.toLowerCase() !== tokenInfo?.symbol.toLowerCase()
        ) {
          setTokenFrom(_token);
        } else {
          // If not founded wrapped and native just use the first one of the list that matches current network
          const _token = select0.find(
            (t) =>
              t.networkName === networkName &&
              t.symbol.toLowerCase() !== tokenInfo?.symbol.toLowerCase(),
          );
          if (_token) {
            setTokenFrom(_token);
          }
        }
      }
    }
  }, [select0, networkName]);

  const handleChangeToken = (token: Token | undefined, type: 'from' | 'to') => {
    if (token) {
      const isNative = isNativeCoinWithoutChainId(token.symbol);
      if (type === 'from') {
        if (
          tokenTo &&
          (token.address.toLowerCase() === tokenTo.address.toLowerCase() ||
            (isNative &&
              token.symbol.toLowerCase() === tokenTo.symbol.toLowerCase()))
        ) {
          setTokenFrom(tokenTo);
          setTokenTo(tokenFrom);
        } else {
          setTokenFrom(token);
        }
      } else {
        if (
          tokenFrom &&
          (token.address.toLowerCase() === tokenFrom.address.toLowerCase() ||
            (isNative &&
              token.symbol.toLowerCase() === tokenFrom.symbol.toLowerCase()))
        ) {
          if (web3State === Web3State.Done) {
            const availableTokenFrom = select0.find((e) =>
              isNative
                ? e.symbol.toLowerCase() === tokenTo?.symbol.toLowerCase()
                : e.address.toLowerCase() === tokenTo?.address.toLowerCase(),
            );

            if (availableTokenFrom) {
              setTokenTo(tokenFrom);
              setTokenFrom(tokenTo);
            } else {
              const newTokenFrom = select0.find((e) =>
                isNative
                  ? e.symbol.toLowerCase() === token?.symbol.toLowerCase()
                  : e.address.toLowerCase() === token?.address.toLowerCase(),
              );

              setTokenTo(tokenFrom);
              setTokenFrom(newTokenFrom);
            }
          } else {
            setTokenTo(tokenFrom);
            setTokenFrom(tokenTo);
          }
        } else {
          setTokenTo(token);
        }
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
    <Box>
      <Box display='flex' justifyContent='center'>
        <Tabs
          className={classes.tabsContainer}
          value={currentTab}
          indicatorColor='primary'
          onChange={handleChangeTab}
          variant='standard'>
          <Tab label={<IntlMessages id='Market' />} {...a11yProps(0)} />
          <Tab label={<IntlMessages id='Limit' />} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box py={2} padding={4}>
        {currentTab === 0 && (
          <MarketForm
            key='MarketForm'
            chainId={chainId}
            account={account}
            networkName={networkName}
            balances={balances}
            select0={select0}
            select1={select1}
            disableReceive={disableReceive}
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
      </Box>
    </Box>
  );
};

export default BuySell;
