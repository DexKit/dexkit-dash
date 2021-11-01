

export interface CoinFeed{
    base: string;
    baseName: string;
    quote: string;
    address: string;
    logo: string;
}


export interface GameGraph{
    id: string,
    type: string,
    status: string,
    duration: string,
    numCoins: string,
    numPlayers: string,
    currentPlayers: string,
    entry: string,
    startedAt?: string,
    endedAt?: string
    
}

export interface PlayerGraph{
    id: string,
    totalWinnedGames: string,
    totalJoinedGames: string,
    totalFirstWinnedGames: string,
    totalThirdWinnedGames: string,
    totalSecondWinnedGames: string,
 
}


