import {Stats} from './stats';
export interface ContractInfo {
  address: string;
  asset_contract_type?: string;
  created_date?: Date;
  name?: string;
  nft_version?: string;
  opensea_version?: string;
  owner: number;
  schema_name: string;
  symbol: string;
  total_supply?: string;
  description?: string;
  external_link?: string;
  image_url?: string;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points?: number;
  payout_address?: string;
  slug: string;
  stats: Stats;
  owned_asset_count: number;
}
