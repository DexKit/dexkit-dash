import {useQuery} from 'react-query';

const GET_GAME_ONCHAIN = 'GET_GAME_ONCHAIN';

export function useGameOnChain(id: string) {
  const query = useQuery([GET_GAME_ONCHAIN, id], (): any => {
    return {};
  });

  return {query};
}
