import { CollectionInfo } from "./collectionInfo.interface";
import { ContractInfo } from "./contractInfo.interface";

export interface AssetContractInfo extends ContractInfo {
  collection: CollectionInfo;
}