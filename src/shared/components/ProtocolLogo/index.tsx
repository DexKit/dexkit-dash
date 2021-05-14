import IconComponent from '@crema/core/Navigation/Icon';
import React from 'react';
import { PROTOCOL } from 'shared/constants/AppEnums';





interface Props {
  protocol: string,
}

const ProtocolLogo = (props:Props) => {

      switch (props.protocol) {
        case PROTOCOL.UNISWAP:
        case PROTOCOL.UNISWAP_V2:
         return <IconComponent icon={{src: 'uniswap.png', type: 'png'}} classes={{}} />
        case PROTOCOL.ZEROX:
        case PROTOCOL.ZEROX_V2:
        case PROTOCOL.ZEROX_V3:
          return <IconComponent icon={{src: '0x.svg', type: 'svg'}} classes={{}} /> 
        case PROTOCOL.BALANCER:
            return <IconComponent icon={{src: 'balancer.svg', type: 'svg'}} classes={{}} /> 
        case PROTOCOL.MOONISWAP:
            return <IconComponent icon={{src: 'mooniswap.svg', type: 'svg'}} classes={{}} /> 
        default:
          return props.protocol
      }



};

export default ProtocolLogo;
