import { Token } from "types/app";
import { AbiItem } from "web3-utils";
import { useWeb3 } from "./useWeb3";

export const useBlokchain = () => {
  const {getWeb3} = useWeb3();
  const tokenAbi: AbiItem[] = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"}], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "payable": false, "type": "function" }, { "constant": true, "inputs": [{"name": "_owner","type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance","type": "uint256"}], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "","type": "string"}], "payable": false, "type": "function" }];
  const pairAbi: AbiItem[] = [{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]


  const onGetToken = async (address: string): Promise<Token | undefined> => {

    const w3 = getWeb3();

    if (w3) {
      try {
        const contract = new w3.eth.Contract(tokenAbi, address);
  
        const data = await Promise.all([
          contract.methods.name().call(),
          contract.methods.symbol().call(),
          contract.methods.decimals().call()
        ]);
  
        return {
          name: data[0], 
          symbol: data[1], 
          decimals: data[2],
          address: address
        } as Token;
      } catch(e) {
        console.log(e);
        return undefined;
      }  
    }
    else {
      return undefined;
    }
  }

  const onGetPair = async (address: string) => {
    const w3 = getWeb3();

    if (w3) {
      try {
        const contract = new w3.eth.Contract(pairAbi, address);
  
        const tokens = await Promise.all([
          contract.methods.token0().call(),
          contract.methods.token1().call(),
        ]);

        console.log('tokens', tokens);
        
        const data = await Promise.all([
          onGetToken(tokens[0]),
          onGetToken(tokens[1])
        ]);
                
        return {token0: data[0], token1: data[1]};
      } catch(e) {
        console.log(e);
        return undefined;
      }  
    }
    else {
      return undefined;
    }
  }

  return {onGetToken, onGetPair};

}
