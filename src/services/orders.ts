import {LimitOrder, SignatureType} from '@0x/protocol-utils';
import {fromTokenUnitAmount} from '@0x/utils';
import {Web3Wrapper} from '@0x/web3-wrapper';
import BigNumber from 'bignumber.js';
import {
  TAKER_FEE_PERCENTAGE,
  ZERO_ADDRESS,
  STAKING_POOL,
  FEE_RECIPIENT,
} from 'shared/constants/Blockchain';
import {Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {BuildLimitOrderParams} from 'types/zerox';
import {SignedOrderException} from 'utils/exceptions/signedOrderException';
import {getExpirationTimeFromSeconds} from 'utils/time_utils';
import {getContractWrappers} from './contract_wrappers';
import {getWeb3Wrapper} from './web3modal';

interface SignedOrderParams {
  baseToken: Token;
  quoteToken: Token;
  amount: number;
  price: number;
  orderSecondsExpirationTime: number;
  affiliateAddress: string;
}

export const createSignedOrder = async (
  params: SignedOrderParams,
  chainId: any,
  account: any,
) => {
  const {
    baseToken,
    quoteToken,
    orderSecondsExpirationTime,
    amount,
    price,
    affiliateAddress,
  } = params;

  if (!chainId || !account) {
    return;
  }

  const expirationTimeSeconds = getExpirationTimeFromSeconds(
    new BigNumber(orderSecondsExpirationTime),
  );

  try {
    const contractWrappers = await getContractWrappers(chainId);
    const web3Wrapper = await getWeb3Wrapper();

    if (!contractWrappers || !web3Wrapper) {
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
  expirationTimeSeconds: BigNumber,
  chainId: ChainId,
  web3Wrapper: Web3Wrapper,
  affiliateAddress?: string,
) => {
  const {account, baseToken, amount, price, quoteToken} = params;

  const baseTokenAmountInUnits = fromTokenUnitAmount(
    amount,
    baseToken.decimals,
  );

  const round = (num: BigNumber): BigNumber =>
    num.integerValue(BigNumber.ROUND_FLOOR);
  const quoteTokenAmountInUnits = round(
    fromTokenUnitAmount(amount * price, quoteToken.decimals),
  );

  const order = new LimitOrder({
    makerToken: baseToken.address,
    takerToken: quoteToken.address,
    makerAmount: baseTokenAmountInUnits,
    takerAmount: quoteTokenAmountInUnits,
    takerTokenFeeAmount: quoteTokenAmountInUnits.multipliedBy(
      new BigNumber(TAKER_FEE_PERCENTAGE),
    ),
    maker: account,
    taker: ZERO_ADDRESS,
    expiry: expirationTimeSeconds,
    pool: STAKING_POOL,
    feeRecipient: FEE_RECIPIENT,
    chainId,
    salt: new BigNumber(Date.now()),
  });

  const signature = await order.getSignatureWithProviderAsync(
    web3Wrapper.getProvider(),
    SignatureType.EIP712,
  );

  return {
    ...order,
    signature,
  };
};
