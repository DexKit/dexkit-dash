import { ContractInfo } from "./contractInfo.interface";

export interface CollectionInfo{
  primary_asset_contracts: ContractInfo[];
  banner_image_url?: string;
  chat_url?: string;
  created_date: Date;
  default_to_fiat: boolean;
  description?: string;
  dev_buyer_fee_basis_points?: string;
  dev_seller_fee_basis_points?: string;
  discord_url?: string;
  display_data: {
    card_display_style?: string;
    images?: string[]
  },
  external_url?: string;
  featured: boolean;
  featured_image_url?: string;
  hidden: boolean;
  safelist_request_status?: string;
  image_url?: string;
  is_subject_to_whitelist:boolean;
  large_image_url?: string;
  medium_username?: string;
  name: string;
  only_proxied_transfers?: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: string;
  payout_address?: string;
  require_email: boolean;
  short_description?: string;
  slug?: string;
  telegram_url?: string;
  twitter_username?: string;
  instagram_username?: string;
  wiki_url?: string;
}