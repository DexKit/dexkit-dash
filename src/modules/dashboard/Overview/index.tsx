import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {onGetReportCardsData, onGetNewsData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import ReportCard from './ReportCard';
import {ReportCards} from 'types/models/Ecommerce';

import ProtocolNavigationUniswap from './ProtocolNavigation/uniswap';
import ProtocolNavigationZRXProtocol from './ProtocolNavigation/zrxprotocol';
import ProtocolNavigationSushiSwap from './ProtocolNavigation/sushiswap';
import ProtocolNavigationBalancer from './ProtocolNavigation/balancer';
import RelatedCourses from './RelatedCourses';
import {RelatedCoursesData} from 'types/models/Academy';

export interface OverviewDataProvider {
  getReportCardsData(): Promise<ReportCards[]>;
}

interface CryptoProps {}

const Overview: React.FC<CryptoProps> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetReportCardsData());
    //  dispatch(onGetCryptoData());
    // dispatch(onGetNewsData());
  }, [dispatch]);

  const {reportCardsData /*, newsData*/} = useSelector<
    AppState,
    AppState['dashboard']
  >(({dashboard}) => dashboard);

  return (
    <>
      <Box pt={{xl: 4}}>
        <GridContainer>
          <Grid item xs={12} md={4}>
            {reportCardsData[0] && <ReportCard data={reportCardsData[0]} />}
          </Grid>
          <Grid item xs={12} md={4}>
            {reportCardsData[1] && <ReportCard data={reportCardsData[1]} />}
          </Grid>
          <Grid item xs={12} md={4}>
            {reportCardsData[2] && <ReportCard data={reportCardsData[2]} />}
          </Grid>

          {/*<Grid style={{ backgroundColor: 'white', borderRadius: 10 }} item xs={12} sm={12} md={4}>
              {newsData && <RelatedCourses relatedCourses={
                newsData.items.map((item, index) => {
                  return {
                    id: index,
                    image: item?.enclosure?.url,
                    title: item.title,
                    author: item.creator,
                    views: '15'
                  } as RelatedCoursesData
                })
              } />}
            </Grid>*/}
          {/* <Grid item xs={12} md={4}>
              <GridContainer >
              <Grid item xs={12} sm={12} md={12}>
                  <PopularCoins title="Trending Coins on ZRX" popularCoins={[cryptoData.popularCoins[0], cryptoData.popularCoins[1]]} />
                </Grid> 
                <Grid style={{ backgroundColor: 'white', borderRadius: 10 }} item xs={12} sm={12} md={12}>
                  {newsData && <RelatedCourses relatedCourses={
                    newsData.items.map((item, index) => {
                      return {
                        id: index,
                        image: item?.enclosure?.url,
                        title: item.title,
                        author: item.creator,
                        views: '15'
                      } as RelatedCoursesData
                    })
                  } />}
                </Grid>
              </GridContainer>
            </Grid>*/}

          <Grid item xs={12} md={4}>
            <ProtocolNavigationUniswap />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProtocolNavigationZRXProtocol />
          </Grid>

          <Grid item xs={12} md={4}>
            <ProtocolNavigationSushiSwap />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProtocolNavigationBalancer />
          </Grid>
          {/*<Grid item xs={12} md={4}>
              <PopularCoins title="Trending Coins on Uniswap" popularCoins={cryptoData.popularCoins} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCoins title="Trending Coins on ZRX" popularCoins={cryptoData.popularCoins} />
            </Grid> */}
        </GridContainer>
      </Box>
    </>
  );
};

export default Overview;
