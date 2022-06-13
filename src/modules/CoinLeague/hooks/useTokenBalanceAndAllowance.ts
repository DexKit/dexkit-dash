
import { useNetworkProvider } from "hooks/provider/useNetworkProvider";
import { useWeb3 } from "hooks/useWeb3";
import { useQuery } from "react-query";
import { getTokenBalancesAndAllowancesWithProvider } from "services/multicall";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { GET_LEAGUES_CHAIN_ID } from "../utils/constants";
import { useFactoryAddress } from "./useCoinLeagueFactoryV3"
import { useLeaguesChainInfo } from "./useLeaguesChainInfo";



export const useTokenBalanceAndAllowance = (address?: string) => {
    const factoryAddress = useFactoryAddress();
    const { account } = useWeb3();
    const { chainId } = useLeaguesChainInfo();
    const provider = useNetworkProvider(
        EthereumNetwork.matic,
        GET_LEAGUES_CHAIN_ID(chainId),
    );

    return useQuery(['GET_TOKEN_ALLOWANCE_AND_BALANBCE', factoryAddress, account, address, chainId], async () => {
        if (!account || !address || !factoryAddress || !provider) {
            return
        }
        const [, tokenBalance] = await getTokenBalancesAndAllowancesWithProvider([address], account, factoryAddress, provider);
        return {
            balance: tokenBalance[address].balance,
            allowance: tokenBalance[address].allowance
        }

    })


}