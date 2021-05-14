import React, {useState} from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import {useIntl} from 'react-intl';
import {makeStyles} from '@material-ui/core/styles';
import IconComponent from '@crema/core/Navigation/Icon';
import { INFOR_CARD as INFOR_CARD_UNISWAP } from '../ProtocolNavigation/uniswap';
import { INFOR_CARD as INFOR_CARD_BALANCER } from '../ProtocolNavigation/balancer';
import { INFOR_CARD as INFOR_CARD_SUSHI } from '../ProtocolNavigation/sushiswap';
import { INFOR_CARD as INFOR_CARD_ZRX } from '../ProtocolNavigation/zrxprotocol';
import { Grid } from '@material-ui/core';
import InfoCard from 'shared/components/InfoCard';
const useStyles = makeStyles(theme => ({
  chipRoot: {
    cursor: 'pointer',
    backgroundColor: '#EFEFEF',
    color: '#737989',
    '&.MuiChip-colorPrimary': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

type protocolsSlugs = 'uniswap' | 'sushi' | 'zrx' | 'balancer'

interface ProtocolCategory{
  slug: protocolsSlugs,
  title: string,
  icon: JSX.Element
}


const protocols: ProtocolCategory[] = [
  {
    slug: 'uniswap',
    title: 'Uniswap',
    icon: <IconComponent icon={{src: 'uniswap.png',type: 'png', }} classes={{}} />
  },
  {
    slug: 'zrx',
    title: 'ZRX Protocol',
    icon: <IconComponent icon={{ src: '0x.svg',type: 'svg', }} classes={{}} />
  },
  {
    slug: 'sushi',
    title: 'SushiSwap',
    icon: <IconComponent icon={{src: 'sushiswap.svg',type: 'svg', }} classes={{}} />
  },
  {
    slug: 'balancer',
    title: 'Balancer',
    icon: <IconComponent icon={{src: 'balancer.svg',type: 'svg', }} classes={{}} />
  }
]

const info_cards = {
    ['uniswap']: INFOR_CARD_UNISWAP,
    ['sushi']: INFOR_CARD_SUSHI,
    ['zrx']: INFOR_CARD_ZRX,
    ['balancer']: INFOR_CARD_BALANCER,
}


const Protocols: React.FC<any> = ({courses}) => {
  const [selectedCategory, setSelectedCategory] = useState<protocolsSlugs>(
    protocols[0].slug,
  );

  const handleChangeCategory = (category: protocolsSlugs) => {
    setSelectedCategory(category);
  };

  const { messages } = useIntl();
  const classes = useStyles();

  return (
    <AppCard
      height={1}
      title={messages['sidebar.protocols']}
      contentStyle={{paddingLeft: 0, paddingRight: 0}}>
      <Box mb={2} px={5} display='flex' alignItems='center' flexWrap='wrap'>
        {protocols.map((item, index) => (
          <Box
            mr={3}
            mb={1}
            key={index}
            onClick={() => handleChangeCategory(item.slug)}>
            <Chip
              className={classes.chipRoot}
              color={item.slug === selectedCategory ? 'primary' : 'secondary'}
              key={index}
              icon={item.icon}
              label={item.title}
              variant="outlined"
            />
          </Box>
        ))}
      </Box>
      <Grid spacing={3} container>
          {info_cards[selectedCategory]
             .map((state, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  key={index}
                  style={{marginBottom: '7px'}}>
                  <InfoCard state={state} icon={state.icon} />
                </Grid>
              ))}
         </Grid>

    </AppCard>
  );
};

export default Protocols;
