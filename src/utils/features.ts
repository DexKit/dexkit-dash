export const FEATURE_TRADE_COINS_ZRX = (chainId?: number): boolean => {
  if (chainId) {
    return (
      [1, 56, 97, 137, 250, 4002, 42220, 43113, 43114, 80001].indexOf(chainId) >
      -1
    );
  }

  return false;
};
