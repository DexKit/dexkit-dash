// Mumbai Price Feeds

import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';
import {ChainId} from 'types/blockchain';
import {BSCPriceFeeds} from './PriceFeeds/bsc';

export const DEXKIT_MULTIPLIER_HOLDING = BigNumber.from(50).mul(
  BigNumber.from(10).pow(18),
);
export const BITTOKEN_MULTIPLIER_HOLDING = BigNumber.from(200).mul(
  BigNumber.from(10).pow(18),
);

export const POLL_INTERVAL_GAMES = 5000;

export const CREATOR_ADDRESSES = [
  '0x529be61AF4FD199456A5Bc67B72CD2F2a0A3FD70',
  '0xF2b48EE89E6A31DA8F664B87581d876d527C62F5',
  '0x3DaC4cbbA58dE26d34f4CB6409D47C676D255841',
  '0x67B40b0cA9620cDec3397E9E2D212b7C317da6dd',
  '0x6E566e755D009E4C2507D470D65Bba43B348cC66',
  '0x33966674b0b5dE370630194e29D9679955A2E043',
  '0x37885951E437d9cD4349d252358d27d921f4f1F0',
  '0x367D8F9DBafc73560633b58b38db67CE48443B27',
  //
  '0x186035678f02f19d311ad24EA73a08EA4cD7f01e',
  '0xD1C86EA01EE183a48C86EDAD3be357B40E106F97',
  '0x77279C13336751281Bfc20F7381475f2db7dEaC0',
  '0xCfc34220DAbd0afA999Db309d9789A463E344380',
  //
  '0xD00995A10dB2E58A1A90270485056629134B151B',
  '0xCB8b2c541E18AdBC8B4B8A42a3CA769f4EB72e6C',
  '0xaf5E3194e9E2D076D9dE7d73CaE3EA23d9278B14',
  // 2b diggy
  '0x1E88a0aD2c8273473883cbf561E4661BAAee9D19',
];

export const CREATOR_PRIZES_ADDRESSES = [
  '0xF2b48EE89E6A31DA8F664B87581d876d527C62F5',
  '0x3DaC4cbbA58dE26d34f4CB6409D47C676D255841',
  '0x67B40b0cA9620cDec3397E9E2D212b7C317da6dd',
  '0x6E566e755D009E4C2507D470D65Bba43B348cC66',
  '0x33966674b0b5dE370630194e29D9679955A2E043',
  '0x37885951E437d9cD4349d252358d27d921f4f1F0',
  '0x367D8F9DBafc73560633b58b38db67CE48443B27',
  //
  '0x529be61AF4FD199456A5Bc67B72CD2F2a0A3FD70',
  '0xA27e256CDD086eF88953b941582bB651582c1454',
  '0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f',
];

export const BITBOY_TEAM = [
  {
    address: '0x186035678f02f19d311ad24EA73a08EA4cD7f01e',
    label: 'Justin',
  },
  {
    address: '0xD1C86EA01EE183a48C86EDAD3be357B40E106F97',
    label: 'TJ',
  },
  {
    address: '0x77279C13336751281Bfc20F7381475f2db7dEaC0',
    label: 'Deezy',
  },
  {
    address: '0xaf5E3194e9E2D076D9dE7d73CaE3EA23d9278B14',
    label: 'Bitboy',
  },
  {
    address: '0xCB8b2c541E18AdBC8B4B8A42a3CA769f4EB72e6C',
    label: 'J Chains',
  },
];

export const CREATOR_LABELS = [
  ...BITBOY_TEAM,
  {
    address: '0xA27e256CDD086eF88953b941582bB651582c1454',
    label: 'Albert Hoffman',
  },
  {
    address: '0x529be61AF4FD199456A5Bc67B72CD2F2a0A3FD70',
    label: 'Albert Hoffman',
  },
];

export const MumbaiPriceFeeds = [
  {
    address: '0x007A22900a3B98143368Bd5906f8E17e9867581b',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    base: 'BTC',
    baseName: 'Bitcoin',
    quote: 'USD',
  },
  {
    address: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    base: 'ETH',
    baseName: 'Ethereum',
    quote: 'USD',
  },
  {
    address: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada',
    base: 'MATIC',
    baseName: 'Polygon',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    quote: 'USD',
  },
];

export const TRADING_VIEW_TICKERS =
  'COINBASE:BTCUSD,COINBASE:ETHUSD,COINBASE:MATICUSD,BINANCE:1INCHUSD,FTX:AAVEUSD,COINBASE:ADAUSD,FTX:ALCXUSD,COINBASE:ALGOUSD,BINANCE:AUDUSDT,BINANCE:BALUSD,COINBASE:BATUSD,COINBASE:BCHUSD,BINANCE:BNBUSD,BITTREX:BNTUSD,GEMINI:BONDUSD,BITFINEX:BSVUSD,BINANCE:BTGUSD,BINANCE:BZRXUSD,FTX:CELUSD,COINBASE:COMPUSD,COINBASE:CRVUSD,KRAKEN:DASHUSD,BITFINEX:DOGEUSD,BITFINEX:DOTUSD,KUCOIN:DPIUSDT,BITFINEX:EOSUSD,COINBASE:ETCUSD,COINBASE:FARMUSD,BINANCE:FXSUSD,FTX:HTUSD,COINBASE:ICPUSD,COINBASE:KNCUSD,BITFINEX:LEOUSD,COINBASE:LINKUSD,COINBASE:LPTUSD,COINBASE:LTCUSD,BITFINEX:LUNAUSD,COINBASE:MANAUSD,BITTREX:MFTUSD,BINANCEUS:IOTAUSD,BINANCEUS:MKRUSD,BITFINEX:NEOUSD,COINBASE:OMGUSD,BINANCE:PAXGUSD,COINBASE:QUICKUSD,COINBASE:REPUSD,BINANCE:SANDUSD,COINBASE:SNXUSD,BINANCE:SOLUSD,FTX:SUSHIUSD,BINANCE:THETAUSD,BINANCE:TRXUSD,COINBASE:UMAUSD,COINBASE:UNIUSD,BINANCE:VETUSD,COINBASE:WBTCUSD,COINBASE:XLMUSD,BINANCE:XMRUSD,SUSHISWAP:XSUSHIUSDT,BITFINEX:XTZUSD,COINBASE:YFIUSD,COINBASE:ZECUSD,COINBASE:ZRXUSD';

// Mumbai Price Feeds

export const MaticPriceFeeds = [
  {
    address: '0xc907E116054Ad103354f2D350FD2514433D57F6f',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    base: 'BTC',
    baseName: 'Bitcoin',
    quote: 'USD',
    tv: 'COINBASE:BTCUSD',
  },
  {
    address: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    base: 'ETH',
    baseName: 'Ethereum',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ETHUSD',
  },
  {
    address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
    base: 'MATIC',
    baseName: 'Polygon',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:MATICUSD',
  },
  {
    address: '0x443C5116CdF663Eb387e72C688D276e702135C87',
    base: '1INCH',
    baseName: '1INCH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png',
    quote: 'USD',
    tv: 'BINANCE:1INCHUSD',
  },
  {
    address: '0x72484B12719E23115761D5DA1646945632979bB6',
    base: 'AAVE',
    baseName: 'Aave',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    quote: 'USD',
    tv: 'FTX:AAVEUSD',
  },
  {
    address: '0x882554df528115a743c4537828DA8D5B58e52544',
    base: 'ADA',
    baseName: 'Cardano',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ADAUSD',
  },
  {
    address: '0x5DB6e61B6159B20F068dc15A47dF2E5931b14f29',
    base: 'ALCX',
    baseName: 'Alchemix',
    logo: 'https://assets.coingecko.com/coins/images/14113/large/Alchemix.png',
    quote: 'USD',
    tv: 'FTX:ALCXUSD',
  },
  {
    address: '0x03Bc6D9EFed65708D35fDaEfb25E87631a0a3437',
    base: 'ALGO',
    baseName: 'Algorand',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/algorand/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ALGOUSD',
  },
  /* {
    address: '0x062Df9C4efd2030e243ffCc398b652e8b8F95C6f',
    base: 'AUD',
    baseName: 'Audius',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998/logo.png',
    quote: 'USD',
    tv: 'BINANCE:AUDUSDT',
  },*/
  {
    address: '0xD106B538F2A868c28Ca1Ec7E298C3325E0251d66',
    base: 'BAL',
    baseName: 'Balancer',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BALUSD',
  },
  {
    address: '0x2346Ce62bd732c62618944E51cbFa09D985d86D2',
    base: 'BAT',
    baseName: 'Basic Attention Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png',
    quote: 'USD',
    tv: 'COINBASE:BATUSD',
  },
  {
    address: '0x327d9822e9932996f55b39F557AEC838313da8b7',
    base: 'BCH',
    baseName: 'Bitcoin Cash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoincash/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:BCHUSD',
  },
  {
    address: '0x82a6c4AF830caa6c97bb504425f6A66165C2c26e',
    base: 'BNB',
    baseName: 'Binance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BNBUSD',
  },
  {
    address: '0xF5724884b6E99257cC003375e6b844bC776183f9',
    base: 'BNT',
    baseName: 'Bancor',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png',
    quote: 'USD',
    tv: 'BITTREX:BNTUSD',
  },
  {
    address: '0x58527C2dCC755297bB81f9334b80b2B6032d8524',
    base: 'BOND',
    baseName: 'BarnBridge',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0391D2021f89DC339F60Fff84546EA23E337750f/logo.png',
    quote: 'USD',
    tv: 'GEMINI:BONDUSD',
  },
  {
    address: '0x8803DD6705F0d38e79790B02A2C43594A0538D22',
    base: 'BSV',
    baseName: 'Bitcoin SV',
    logo: 'https://assets.coingecko.com/coins/images/6799/large/BSV.png',
    quote: 'USD',
    tv: 'BITFINEX:BSVUSD',
  },
  {
    address: '0x2f2C605F28DE314bc579a7c0FDf85536529E9825',
    base: 'BTG',
    baseName: 'Bitcoin Gold',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoingold/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BTGUSD',
  },
  {
    address: '0xc9ECF45956f576681bDc01F79602A79bC2667B0c',
    base: 'CEL',
    baseName: 'Celsius Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d/logo.png',
    quote: 'USD',
    tv: 'FTX:CELUSD',
  },
  {
    address: '0x2A8758b7257102461BC958279054e372C2b1bDE6',
    base: 'COMP',
    baseName: 'Coumpound',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
    quote: 'USD',
    tv: 'COINBASE:COMPUSD',
  },
  {
    address: '0x336584C8E6Dc19637A5b36206B1c79923111b405',
    base: 'CRV',
    baseName: 'Curve Dao Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
    quote: 'USD',
    tv: 'COINBASE:CRVUSD',
  },
  {
    address: '0xD94427eDee70E4991b4b8DdCc848f2B58ED01C0b',
    base: 'DASH',
    baseName: 'Dash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/dash/info/logo.png',
    quote: 'USD',
    tv: 'KRAKEN:DASHUSD',
  },
  {
    address: '0xbaf9327b6564454F4a3364C33eFeEf032b4b4444',
    base: 'DOGE',
    baseName: 'Doge',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:DOGEUSD',
  },
  {
    address: '0xacb51F1a83922632ca02B25a8164c10748001BdE',
    base: 'DOT',
    baseName: 'Polkadot',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:DOTUSD',
  },
  {
    address: '0x2e48b7924FBe04d575BA229A59b64547d9da16e9',
    base: 'DPI',
    baseName: 'DeFiPulse Index',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:DPIUSDT',
  },
  {
    address: '0xd6285F06203D938ab713Fa6A315e7d23247DDE95',
    base: 'EOS',
    baseName: 'EOS',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/eos/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:EOSUSD',
  },
  {
    address: '0xDf3f72Be10d194b58B1BB56f2c4183e661cB2114',
    base: 'ETC',
    baseName: 'Ethereum Classic',
    logo: 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png',
    quote: 'USD',
    tv: 'COINBASE:ETCUSD',
  },
  {
    address: '0xDFb138ba3A6CCe675A6F5961323Be31eE42E40ff',
    base: 'FARM',
    baseName: 'Harvest Finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0246c9032bC3A600820415aE600c6388619A14D/logo.png',
    quote: 'USD',
    tv: 'COINBASE:FARMUSD',
  },
  // Confirmar isto
  {
    address: '0x6C0fe985D3cAcbCdE428b84fc9431792694d0f51',
    base: 'FXS',
    baseName: 'Frax Share',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0/logo.png',
    quote: 'USD',
    tv: 'BINANCE:FXSUSD',
  },
  {
    address: '0x6F8F9e75C0285AecE30ADFe1BCc1955f145d971A',
    base: 'HT',
    baseName: 'Huobi Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6f259637dcD74C767781E37Bc6133cd6A68aa161/logo.png',
    quote: 'USD',
    tv: 'FTX:HTUSD',
  },
  {
    address: '0x84227A76a04289473057BEF706646199D7C58c34',
    base: 'ICP',
    baseName: 'Internet Computer',
    logo: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
    quote: 'USD',
    tv: 'COINBASE:ICPUSD',
  },
  {
    address: '0x10e5f3DFc81B3e5Ef4e648C4454D04e79E1E41E2',
    base: 'KNC',
    baseName: 'Kyber Network Crystal',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202/logo.png',
    quote: 'USD',
    tv: 'COINBASE:KNCUSD',
  },
  {
    address: '0x1C4A8C3A28b0B3c3a0a6E7650694d9Cd5dB12DE5',
    base: 'LEO',
    baseName: 'Leo Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2AF5D2aD76741191D15Dfe7bF6aC92d4Bd912Ca3/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:LEOUSD',
  },
  {
    address: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665',
    base: 'LINK',
    baseName: 'Chainlink',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LINKUSD',
  },
  {
    address: '0xBAaF11CeDA1d1Ca9Cf01748F8196653c9656a400',
    base: 'LPT',
    baseName: 'Livepeer',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x58b6A8A3302369DAEc383334672404Ee733aB239/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LPTUSD',
  },
  {
    address: '0xEB99F173cf7d9a6dC4D889C2Ad7103e8383b6Efa',
    base: 'LTC',
    baseName: 'Litecoin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/litecoin/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LTCUSD',
  },
  {
    address: '0x1248573D9B62AC86a3ca02aBC6Abe6d403Cd1034',
    base: 'LUNA',
    baseName: 'Terra',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/terra/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:LUNAUSD',
  },
  {
    address: '0xA1CbF3Fe43BC3501e3Fc4b573e822c70e76A7512',
    base: 'MANA',
    baseName: 'Decentraland',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png',
    quote: 'USD',
    tv: 'COINBASE:MANAUSD',
  },
  {
    address: '0x6E53C1c22427258BE55aE985a65c0C87BB631F9C',
    base: 'MFT',
    baseName: 'Hifi Finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xDF2C7238198Ad8B389666574f2d8bc411A4b7428/logo.png',
    quote: 'USD',
    tv: 'BITTREX:MFTUSD',
  },
  {
    address: '0x7d620D05c317A426903596432A5ca83375dC8d2A',
    base: 'MIOTA',
    baseName: 'IOTA',
    logo: 'https://assets.coingecko.com/coins/images/692/large/IOTA_Swirl.png',
    quote: 'USD',
    tv: 'BINANCEUS:IOTAUSD',
  },
  {
    address: '0xa070427bF5bA5709f70e98b94Cb2F435a242C46C',
    base: 'MKR',
    baseName: 'Maker',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    quote: 'USD',
    tv: 'BINANCEUS:MKRUSD',
  },
  {
    address: '0x74b3587A23eE786A43C8529c2e98D3C05a8fb1fB',
    base: 'NEO',
    baseName: 'NEO',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/neo/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:NEOUSD',
  },
  {
    address: '0xa8B05B6337040c0529919BDB51f6B40A684eb08C',
    base: 'OHM',
    baseName: 'Olympus',
    logo: 'https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png',
    quote: 'USD',
    tv: 'SUSHISWAP:OHMDAI',
  },
  {
    address: '0x93FfEE768F74208a7b9f2a4426f0F6BCbb1D09de',
    base: 'OMG',
    baseName: 'OMG Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xd26114cd6EE289AccF82350c8d8487fedB8A0C07/logo.png',
    quote: 'USD',
    tv: 'COINBASE:OMGUSD',
  },
  {
    address: '0x0f6914d8e7e1214CDb3A4C6fbf729b75C69DF608',
    base: 'PAXG',
    baseName: 'PAX Gold',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png',
    quote: 'USD',
    tv: 'BINANCE:PAXGUSD',
  },
  {
    address: '0xa058689f4bCa95208bba3F265674AE95dED75B6D',
    base: 'QUICK',
    baseName: 'Quickswap',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x831753DD7087CaC61aB5644b308642cc1c33Dc13/logo.png',
    quote: 'USD',
    tv: 'COINBASE:QUICKUSD',
  },
  {
    address: '0x634b084372f88848aC8F8006DC178aA810A58E89',
    base: 'REP',
    baseName: 'Augur',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png',
    quote: 'USD',
    tv: 'COINBASE:REPUSD',
  },
  {
    address: '0x3D49406EDd4D52Fb7FFd25485f32E073b529C924',
    base: 'SAND',
    baseName: 'The Sandbox',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3845badAde8e6dFF049820680d1F14bD3903a5d0/logo.png',
    quote: 'USD',
    tv: 'BINANCE:SANDUSD',
  },
  {
    address: '0xbF90A5D9B6EE9019028dbFc2a9E50056d5252894',
    base: 'SNX',
    baseName: 'Synthetix Network Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    quote: 'USD',
    tv: 'COINBASE:SNXUSD',
  },
  {
    address: '0x10C8264C0935b3B9870013e057f330Ff3e9C56dC',
    base: 'SOL',
    baseName: 'Solana',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:SOLUSD',
  },
  {
    address: '0x87eF348CADd1Ed7cc7A5F4Fefb20325216AA2cEb',
    base: 'SETHET',
    baseName: 'Lido Staked Ether',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png',
    quote: 'USD',
  },
  {
    address: '0x49B0c695039243BBfEb8EcD054EB70061fd54aa0',
    base: 'SUSHI',
    baseName: 'Sushi',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
    quote: 'USD',
    tv: 'FTX:SUSHIUSD',
  },
  {
    address: '0x38611b09F8f2D520c14eA973765C225Bf57B9Eac',
    base: 'THETA',
    baseName: 'Theta Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/theta/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:THETAUSD',
  },
  {
    address: '0x307cCF7cBD17b69A487b9C3dbe483931Cf3E1833',
    base: 'TRX',
    baseName: 'TRON',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:TRXUSD',
  },
  {
    address: '0x33D9B1BAaDcF4b26ab6F8E83e9cb8a611B2B3956',
    base: 'UMA',
    baseName: 'UMA',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png',
    quote: 'USD',
    tv: 'COINBASE:UMAUSD',
  },
  {
    address: '0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C',
    base: 'UNI',
    baseName: 'Uniswap',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    quote: 'USD',
    tv: 'COINBASE:UNIUSD',
  },
  {
    address: '0xD78bc11ef3256e3CE9dC0DF0fa7be9E9afc07f95',
    base: 'VET',
    baseName: 'VeChain',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/vechain/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:VETUSD',
  },
  {
    address: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
    base: 'WBTC',
    baseName: 'Wrapped Bitcoin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    quote: 'USD',
    tv: 'COINBASE:WBTCUSD',
  },
  {
    address: '0x692AE5510cA9070095A496dbcFBCDA99D4024Cd9',
    base: 'XLM',
    baseName: 'Stellar',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:XLMUSD',
  },
  {
    address: '0xBE6FB0AB6302B693368D0E9001fAF77ecc6571db',
    base: 'XMR',
    baseName: 'Monero',
    logo: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
    quote: 'USD',
    tv: 'BINANCE:XMRUSD',
  },
  {
    address: '0x785ba89291f676b5386652eB12b30cF361020694',
    base: 'XRP',
    baseName: 'XRP',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:XRPUSD',
  },
  {
    address: '0xC16Cb62CddE46f43Fd73257b957Bf527f07b51C0',
    base: 'XSUSHI',
    baseName: 'xSUSHI',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272/logo.png',
    quote: 'USD',
    tv: 'SUSHISWAP:XSUSHIUSDT',
  },
  {
    address: '0x691e26AB58ff05800E028b0876A41B720b26FC65',
    base: 'XTZ',
    baseName: 'Tezos',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tezos/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:XTZUSD',
  },
  {
    address: '0x9d3A43c111E7b2C6601705D9fcF7a70c95b1dc55',
    base: 'YFI',
    baseName: 'yearn.finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
    quote: 'USD',
    tv: 'COINBASE:YFIUSD',
  },
  {
    address: '0xBC08c639e579a391C4228F20d0C29d0690092DF0',
    base: 'ZEC',
    baseName: 'Zcash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zcash/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ZECUSD',
  },
  {
    address: '0x6EA4d89474d9410939d429B786208c74853A5B47',
    base: 'ZRX',
    baseName: '0x',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ZRXUSD',
  },
];

export const PriceFeeds = {
  [ChainId.Mumbai]: MumbaiPriceFeeds,
  [ChainId.Matic]: MaticPriceFeeds,
  [ChainId.Binance]: BSCPriceFeeds,
};

export const CHAMPIONS: {[key: number]: string} = {
  [ChainId.Matic]: '0xf2a669a2749073e55c56e27c2f4edadb7bd8d95d',
  [ChainId.Binance]: '',
  [ChainId.Mumbai]: '0x6e606c082dEcb1BA4710085a7E2c968f58B484e0',
};

export const SALE_EARLY_FIRST_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1637150592,
  [ChainId.Matic]: 1637211600,
  [ChainId.Binance]: 0,
};

export const FIRST_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1637236211,
  [ChainId.Matic]: 1637254800,
  [ChainId.Binance]: 0,
};

export const SALE_EARLY_SECOND_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1636752511,
  [ChainId.Matic]: 1638421200,
  [ChainId.Binance]: 0,
};

export const SECOND_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1636752511,
  [ChainId.Matic]: 1638422100,
  [ChainId.Binance]: 0,
};

export const SALE_EARLY_THIRD_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1636752511,
  [ChainId.Matic]: 1639631700,
  [ChainId.Binance]: 0,
};

export const THIRD_ROUND_DATE: {[key: number]: number} = {
  [ChainId.Mumbai]: 1636752511,
  [ChainId.Matic]: 1639674000,
};

export const EARLY_ACCESS_KIT_AMOUNT: {[key: number]: number} = {
  [ChainId.Matic]: 50,
  [ChainId.Mumbai]: 50,
  [ChainId.Binance]: 0,
};

export const EARLY_ACCESS_BITT_AMOUNT: {[key: number]: number} = {
  [ChainId.Matic]: 200,
  [ChainId.Mumbai]: 200,
  [ChainId.Binance]: 0,
};

export const EVENT_HOLDING_AMOUNT: {[key: number]: BigNumber} = {
  [ChainId.Matic]: ethers.utils.parseUnits('115', 'ether'),
  [ChainId.Mumbai]: ethers.utils.parseUnits('100', 'wei'),
  [ChainId.Binance]: ethers.utils.parseUnits('0.01', 'ether'),
};

export const COIN_LEAGUES_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0xA67B9dBfb1371DEBB7f60B681A74798f014cb007',
  [ChainId.Matic]: '0xc93f920483Db1122D6Fc7f2f832C3610c73C0C8E',
  [ChainId.Binance]: '0x34C21825ef6Bfbf69cb8748B4587f88342da7aFb',
};

export const COIN_LEAGUES_NFT_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0xb95051B17C42DE313F40623dB67D4E8087d7AdFA',
  [ChainId.Matic]: '0xeb1eb51AB02C824f0c6F43cEcb91C474E6a0Ef32',
  [ChainId.Binance]: '',
};

export const DISABLE_CHAMPIONS_ID = '500000';

export const AFFILIATE_FIELD = 'league-affiliate';

export const GAME_METADATA_API =
  'https://coinleague-app-api-yxwk6.ondigitalocean.app';
//export const GAME_METADATA_API = 'http://localhost:4001';

export const PROFILE_API = `${GAME_METADATA_API}/api/profile`;
