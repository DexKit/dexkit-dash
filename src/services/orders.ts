import { LimitOrder, SignatureType }   from '@0x/protocol-utils';
import { Web3Wrapper } from "@0x/web3-wrapper";
import BigNumber from "bignumber.js";
import { useWeb3 } from "hooks/useWeb3";
import { TAKER_FEE_PERCENTAGE, ZERO_ADDRESS, STAKING_POOL, FEE_RECIPIENT } from "shared/constants/Blockchain";
import { OrderSide, Token } from "types/app";
import { ChainId } from "types/blockchain";
import { BuildLimitOrderParams } from "types/zerox";
import { SignedOrderException } from "utils/exceptions/signedOrderException";
import { getExpirationTimeFromSeconds } from "utils/time_utils";
import { tokenAmountInUnitsToBigNumber, unitsInTokenAmount } from 'utils/tokens';
import { getContractWrappers } from "./contract_wrappers";
import { getWeb3Wrapper } from "./web3modal";

interface SignedOrderParams{
    baseToken: Token;
    quoteToken: Token;
    // This amount should be the minimal unit of the token
    amount: BigNumber;
    price: BigNumber;
    side: OrderSide;
    orderSecondsExpirationTime: BigNumber;
    affiliateAddress: string;

}


export const createSignedOrder = async (params: SignedOrderParams) => {
        const {baseToken, quoteToken, side, orderSecondsExpirationTime, amount, price, affiliateAddress} = params;
        const {chainId, account  } = useWeb3();
        if(!chainId || !account){
            return;
        }
       
        const expirationTimeSeconds =  getExpirationTimeFromSeconds(orderSecondsExpirationTime)
    
        try {
            const contractWrappers = await getContractWrappers(chainId);
            const web3Wrapper = await getWeb3Wrapper();
            if(!contractWrappers || !web3Wrapper){
                return;
            }

            const order = await buildLimitOrderV4(
                {
                    account,
                    amount,
                    price,
                    baseToken: baseToken,
                    quoteToken: quoteToken,
                    exchangeAddress: contractWrappers.exchange.address,
                },
                side,
                expirationTimeSeconds,
                chainId,
                web3Wrapper,
                affiliateAddress,
            );

            return order;
        } catch (error) {
            throw new SignedOrderException(error.message);
        }
};


const buildLimitOrderV4 = async (
    params: BuildLimitOrderParams,
    side: OrderSide,
    expirationTimeSeconds: BigNumber,
    chainId: ChainId,
    web3Wrapper: Web3Wrapper,
    affiliateAddress?: string,
) => {
    const { account, baseToken,  amount, price, quoteToken } = params;
 
    const baseTokenAmountInUnits = tokenAmountInUnitsToBigNumber(amount, baseToken.decimals);

    const quoteTokenAmountInUnits = baseTokenAmountInUnits.multipliedBy(price);

    const quoteTokenDecimals = quoteToken.decimals;
    const round = (num: BigNumber): BigNumber => num.integerValue(BigNumber.ROUND_FLOOR);
    const quoteTokenAmountInBaseUnits = round(
        unitsInTokenAmount(quoteTokenAmountInUnits.toString(), quoteTokenDecimals),
    );
   
    const isBuy = side === OrderSide.Buy;
    const takerAmount = isBuy ? amount : quoteTokenAmountInBaseUnits;
    const order = new LimitOrder({
        makerToken: isBuy ? quoteToken.address : baseToken.address,
        takerToken: isBuy ? baseToken.address : quoteToken.address,
        makerAmount: isBuy ? quoteTokenAmountInBaseUnits : amount,
        takerAmount,
        takerTokenFeeAmount: takerAmount.multipliedBy(new BigNumber(TAKER_FEE_PERCENTAGE)),
        maker: account,
        taker: ZERO_ADDRESS,
        expiry: expirationTimeSeconds,
        pool: STAKING_POOL,
        feeRecipient: FEE_RECIPIENT,
        chainId,
        salt: new BigNumber(Date.now()),
    })
    
    
    const signature = await order.getSignatureWithProviderAsync(
        web3Wrapper.getProvider(),
        SignatureType.EIP712,
    );
    
    // timestamp ? getExpirationTimeFromDate(timestamp) : getExpirationTimeOrdersFromConfig(),
    return {
        ...order,
        signature,
    }
};
