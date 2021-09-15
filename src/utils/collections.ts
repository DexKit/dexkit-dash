import {Collection} from 'types/myApps';
import {CollectionInfo} from 'types/opensea/collectionInfo.interface';

export function collectionInfo2Collection(
  ...c: CollectionInfo[]
): Collection[] {
  return c.map((_c) => {
    return {
      address:
        _c?.primary_asset_contracts?.length > 0
          ? _c?.primary_asset_contracts[0]?.address
          : undefined,
      imageUrl: _c?.image_url,
      name: _c?.name,
      slug: _c?.slug,
      description: _c?.description,
      assetCount: undefined,
      id: _c?.slug,
    } as Collection;
  });
}

export function collection2CollectionInfo(
  ...c: Collection[]
): CollectionInfo[] {
  return c.map((_c) => {
    return {
      address: _c?.address,
      imageUrl: _c?.imageUrl,
      name: _c?.name,
      slug: _c?.slug,
      description: _c?.description,
      created_date: new Date(),
      default_to_fiat: false,
      display_data: [],
      featured: false,
      hidden: false,
      is_subject_to_whitelist: false,
      opensea_buyer_fee_basis_points: '',
      opensea_seller_fee_basis_points: '',
      primary_asset_contracts: [],
      require_email: false,
      banner_image_url: undefined,
    } as CollectionInfo;
  });
}
