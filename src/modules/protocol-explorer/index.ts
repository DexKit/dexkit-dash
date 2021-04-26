import { uniswapConfigs }  from './uniswap';
import { zrxprotocolConfigs } from './0x';
import { balancerConfigs } from './balancer';
import { sushiswapConfigs } from './sushiswap';

export const protocolExplorerConfigs = [ 
    ...uniswapConfigs,
    ...zrxprotocolConfigs,
    ...balancerConfigs,
    ...sushiswapConfigs,
]

