import { BigNumber } from "@0x/utils";
import { Token } from "types/ethereum";
import { Kit } from "types/models/Kit";


const tokens: Token[] = [
	{
		address: '0x12345678901234567890123456789012',
		decimals: 4,
		displayDecimals: 4,
		name: 'Ethe',
		symbol: 'Ethe',
		icon: 'assets/images/etherium.png',
		price_usd: new BigNumber(500),
		price_usd_24h_change: new BigNumber(0.00003),
		c_id: '0x12345678901234567890123456789012'
	},
	{
		address: '0x765432189012345678901234567234012',
		decimals: 1,
		displayDecimals: 4,
		name: 'Bitcoin',
		symbol: 'BTC',
		icon: 'assets/images/bitcoin.png',
		price_usd: new BigNumber(50000),
		price_usd_24h_change: new BigNumber(1.5),
		c_id: '0x765432189012345678901234567234012'
	},
	{
		address: '0x987654322012345678901234567234011',
		decimals: 4,
		displayDecimals: 4,
		icon: 'assets/images/ripple.png',
		name: 'Monero',
		symbol: 'MON',
		price_usd: new BigNumber(100),
		price_usd_24h_change: new BigNumber(0.005),
		c_id: '0x987654322012345678901234567234011'
	},
];

const kits: Kit[] = [
	{
		c_id: '0x987654322012345678901234567234011',
		icon: 'assets/images/dashboard/1_sales_icon.png',
		name: 'Aggregator',
		price_usd: new BigNumber(Math.random() * 100),
		price_usd_24h_change: new BigNumber(Math.random())
	},
	{
		c_id: '0x765432189012345678901234567234012',
		icon: 'assets/images/dashboard/commission_sale.png',
		name: 'Marketplace',
		price_usd: new BigNumber(Math.random() * 100),
		price_usd_24h_change: new BigNumber(Math.random())
	},
	{
		c_id: '0x12345678901234567890123456789012',
		icon: 'assets/images/metricsIcons/revenue.png.png',
		name: 'Exchange',
		price_usd: new BigNumber(Math.random() * 100),
		price_usd_24h_change: new BigNumber(Math.random())
	},
];
export default { tokens, kits }