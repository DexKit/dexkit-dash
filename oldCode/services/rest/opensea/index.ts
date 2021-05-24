import axios from 'axios';
import { AssetContractInfo } from 'types/opensea/assetContractInfo.interface';
import { OPENSEA_REST_API } from 'utils/constants';

const openseaClient = axios.create({
  baseURL: OPENSEA_REST_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getOpensea<T = any>(url: string): Promise<T | undefined> {
  try {
    const response = await openseaClient.get(url);
    const { data }: {data: T} = response;
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}

export function getCollectionInfo(address: string) {
  return getOpensea<AssetContractInfo>(`/asset_contract/${address}`);
}