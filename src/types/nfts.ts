export interface TokenMetadata {
  attributes?: any[];
  image?: string;
  image_url?: string;
  external_link?: string;
  name?: string;
  description?: string;
}

export interface NftToken {
  tokenId?: number;
  metadata?: TokenMetadata;
  owners?: string[];
}
