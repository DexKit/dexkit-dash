import {useQuery} from 'react-query';
import {getContractBaseURI} from 'services/nfts';

export const useCollectionBaseURI = (address: string) => {
  const baseURIquery = useQuery(['GetBaseURI'], () => {
    return getContractBaseURI(address);
  });
  return baseURIquery;
};
