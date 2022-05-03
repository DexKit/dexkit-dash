import { BigNumber } from "ethers";


const USD_POWER_NUMBER = 10 ** 8;
export const convertUSDPriceUnit = (price?: BigNumber) => {
    if (price) {
        return price.toNumber() / USD_POWER_NUMBER;

    } else {
        return null;
    }


}