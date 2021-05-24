import { BigNumber } from "@0x/utils";

export interface Kit{
    c_id: string;
    icon: string;
    name: string;
    price_usd_24h_change: BigNumber | number | string |undefined | null;
    price_usd: BigNumber | number | string | undefined | null;
}