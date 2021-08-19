export interface Erc721Data {
  name: string;
  symbol: string;
  baseUri: string;
}

export enum CollectionSetupSteps {
  Collection,
  Items,
  Deploy,
}

export const DISPLAY_TYPE_BOOST_NUMBER = 'boost_number';
export const DISPLAY_TYPE_BOOST_PERCENTAGE = 'boost_percentage';
export const DISPLAY_TYPE_NUMBER = 'number';

// see https://docs.opensea.io/docs/metadata-standards for more.
export interface CollectionAttribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export interface CollectionItem {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes?: CollectionAttribute[];
}

export interface CollectionItemData {
  id: string;
  image: File | null;
  name: string;
  description: string;
  attributes: CollectionAttribute[];
}

export interface CollectionData {
  name: string; // name for the collection
  description: string; // description of the collection
  image: string; // image to show on opensea
  external_link: string; // link to and external source
  seller_fee_basis_points: number; // 100 = Indicates a 1% seller fee. on OpenSea
  fee_recipient: string; // ex. "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721",
}

export enum ContractStatus {
  UploadImages,
  UploadMetadata,
  CreateCollection,
  Minting,
  Finalized,
}
