export interface UniswapToken {

    name: string,
    
    logoURI: string 
    
    keywords: string[],
    
    timestamp: string,
    
    tokens: {
        chainId: number;

        address: string;
    
        name: string;
    
        symbol: string;
    
        decimals: number;
    
        logoURI: string;
    }[]

}
