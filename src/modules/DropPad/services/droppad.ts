import { BigNumber, Contract, ContractTransaction, ethers, providers } from "ethers"
import { getEthers, getProvider } from "services/web3modal"
import { ChainId } from "types/blockchain"
import { Drop } from "../utils/types"
import dropAbi from '../constants/ABI/CoinsLeagueChampionsMumbai.json';

// We get drops here
export const getDrops = () : Drop[] => {
        return [
            {
                name: 'CoinLeague Champions',
                symbol: 'Champions',
                imageURL: '/images/coinleagues.svg',
                description: 'Coinleagues Champions Drop',
                address: '0xe079d901807Baa2F94F4723E4A53fC2Ec41E3D5a',
                chainId: ChainId.Matic,
                price: BigNumber.from('1000000000000000'),
                startDate: 1634970357,
                earlyAccessDate: 1632971577,
                baseURI: 'https://coinleaguechampions.dexkit.com/api/',
        }]
}

export const getDropContract = async (address: string) => {
    const appProvider = getProvider();
    const provider = new providers.Web3Provider(
       appProvider 
    ).getSigner();
    return  new ethers.Contract(address, dropAbi.abi, provider);
};

const GAS_PRICE_MULTIPLIER = 2;
export const mintNFT = async (address: string, value: string) => {
    const ethers = getEthers()
    const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);
  
    return (
      await  getDropContract(address)
    ).safeMint({gasPrice, value}) as Promise<ContractTransaction>;
  };