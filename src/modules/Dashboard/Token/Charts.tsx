import React, {useEffect, useState, useContext} from 'react';
import {useIntl} from 'react-intl';
import {
  makeStyles,
  Tabs,
  Tab,
  Grid,
  Card,
  Tooltip,
  CardContent,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import {EthereumNetwork, ThemeMode} from '../../../shared/constants/AppEnums';
import {Token} from 'types/app';
import AppContextPropsType from 'types/AppContextPropsType';
import {AppContext} from '@crema';

const BinanceTVChartContainer = React.lazy(
  () => import('shared/components/chart/BinanceTVChart/tv_chart'),
);

const BitqueryTVChartContainer = React.lazy(
  () => import('shared/components/chart/BitqueryTVChart/tv_chart'),
);

function a11yProps(index: any) {
  return {
    id: `chart-tab-${index}`,
    'aria-controls': `chart-tabpanel-${index}`,
  };
}

enum ChartSource {
  DEX,
  Binance,
}

interface TabPanelProps {
  children: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanelChart(props: TabPanelProps) {
  const {children, value, index} = props;
  return <>{value === index ? children || null : null}</>;
}

type ChartsProps = {
  tokenInfo?: Token;
  networkName: EthereumNetwork;
  chainId: any;
};

export const useStyles = makeStyles(() => ({
  tabsContainer: {
    width: '350px',
  },
  iframeContainer: {
    display: 'flex',
    minHeight: 450,
    '& iframe': {
      minHeight: 450,
    },
  },
}));

const Charts: React.FC<ChartsProps> = ({tokenInfo, networkName, chainId}) => {
  const [chartSource, setChartSource] = useState<ChartSource>(ChartSource.DEX);
  const [chartSymbol, setChartSymbol] = useState<string>();
  const classes = useStyles();
  const {messages} = useIntl();
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

  const onSetChartSource = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === ChartSource.Binance) {
      setChartSource(ChartSource.Binance);
      if (tokenInfo && tokenInfo.symbol) {
        setChartSymbol(`${tokenInfo.symbol?.toUpperCase()}USDT`);
      }
    }
    if (newValue === ChartSource.DEX) {
      setChartSource(ChartSource.DEX);
      if (tokenInfo && tokenInfo.symbol) {
        setChartSymbol(
          `${networkName}:${tokenInfo.symbol?.toUpperCase()}:${
            tokenInfo.address
          }`,
        );
      }
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (tokenInfo) {
      chartSource === ChartSource.DEX
        ? setChartSymbol(
            `${networkName}:${tokenInfo?.symbol?.toUpperCase()}:${
              tokenInfo?.address
            }`,
          )
        : setChartSymbol(`${tokenInfo?.symbol?.toUpperCase()}USDT`);
    }
  }, [tokenInfo, networkName]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={12}>
        <Card>
          <Tabs
            value={chartSource}
            onChange={onSetChartSource}
            aria-label='chart tabs'
            indicatorColor='primary'>
            <Tab
              label={
                <Tooltip title={messages['app.dashboard.chartDexExchange']}>
                  <span>DEX</span>
                </Tooltip>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Tooltip title={messages['app.dashboard.chartBinanceExchange']}>
                  <span>Binance</span>
                </Tooltip>
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <CardContent className={classes.iframeContainer}>
            {!chartSymbol ? (
              <Skeleton variant='rect' height={370} />
            ) : (
              <>
                <TabPanelChart value={chartSource} index={0}>
                  {/* <TVChartContainer
                                    symbol={chartSymbol}
                                    chainId={chainId}
                                    darkMode={isDark}
                                 />*/}

                  <BitqueryTVChartContainer
                    symbol={chartSymbol}
                    darkMode={isDark}
                  />
                </TabPanelChart>
                <TabPanelChart value={chartSource} index={1}>
                  <BinanceTVChartContainer
                    symbol={chartSymbol}
                    chainId={chainId}
                    darkMode={isDark}
                  />
                </TabPanelChart>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Charts;
