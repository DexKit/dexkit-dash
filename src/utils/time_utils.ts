import { BigNumber } from '@0x/utils';

export const getExpirationTimeFromSeconds = (seconds: BigNumber) => {
    return new BigNumber(Math.floor(new Date().valueOf() / 1000) + seconds.toNumber());
};
