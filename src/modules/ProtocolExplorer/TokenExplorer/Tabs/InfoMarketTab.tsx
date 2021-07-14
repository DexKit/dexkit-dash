import React from "react";
import GridContainer from "@crema/core/GridContainer";

import { EthereumNetwork, EXCHANGE } from "shared/constants/AppEnums";
import { useTokenMarket } from "hooks/protocolExplorer/useTokenMarket";
import { Token } from "types/app";
import InfoToken from "modules/ProtocolExplorer/Common/InfoToken";



type Props = {
    tokenInfo: Token;
    networkName: EthereumNetwork;
}


export const InfoMarketTab = (props: Props) => {
    const { tokenInfo, networkName } = props;
    const { loading,  data } = useTokenMarket(networkName, EXCHANGE.ALL, tokenInfo);
    return (
       
                <InfoToken token={tokenInfo} data={data} loading={loading} networkName={networkName}/>

    )


}