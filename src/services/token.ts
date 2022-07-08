import { BigNumber, ContractTransaction, ethers, providers } from "ethers"

const ApproveAbi = [
    'function approve(address _spender, uint256 _value) public returns (bool success)',
];

export const approveToken = async (tokenAddress: string, spender: string, amountToSpend: BigNumber, provider: any) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract(tokenAddress, ApproveAbi, signer);

    return await contract.approve(spender, amountToSpend) as ContractTransaction;

}