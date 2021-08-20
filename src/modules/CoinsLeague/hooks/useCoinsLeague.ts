
import { useWeb3 } from "hooks/useWeb3";
import { useCallback,  useEffect,  useState } from "react"

import { Web3State } from "types/blockchain";
import { Game } from "types/coinsleague";
import { joinGame, startGame, endGame, withdrawGame, abortGame, getWinner } from "../services/coinsLeague";

/**
 * return all data related to game
 * @param address 
 * @returns 
 */
export const useCoinsLeague = (address?: string) => {
    const [winner, setWinner] = useState<any>();
    const {web3State, account} = useWeb3();
    
    useEffect(()=> {
        if(!address || ! account){
            return;
        }
        getWinner(address ,account).then(w=>{
            setWinner({
                place: w.place,
                address: w.winner_address,
                score: w.score,
                claimed: w.claimed
            })
        })
    }, [address, account])



    const onJoinGameCallback = useCallback(async (feeds: string[], amount: string) => {
        if(web3State !== Web3State.Done || !address){
            return;
        }

        const tx = await joinGame(address, feeds, amount);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address])

    const onStartGameCallback = useCallback(async () => {
        if(web3State !== Web3State.Done || !address){
            return;
        }

        const tx = await startGame(address);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address]);

    const onEndGameCallback = useCallback(async () => {
        if(web3State !== Web3State.Done || !address){
            return;
        }
        const tx = await endGame(address);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address])

    const onClaimCallback = useCallback(async () => {
        if(web3State !== Web3State.Done || !address){
            return;
        }
        const tx = await endGame(address);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address])

    const onWithdrawCallback = useCallback(async () => {
        if(web3State !== Web3State.Done || !address){
            return;
        }
        const tx = await withdrawGame(address);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address])

    const onAbortGameCallback = useCallback(async () => {
        if(web3State !== Web3State.Done || !address){
            return;
        }
        const tx = await abortGame(address);
        await tx.wait();
        alert('Game Joined');
    },[web3State, address])

   
   

    return {onJoinGameCallback, onStartGameCallback, onEndGameCallback, onClaimCallback, onWithdrawCallback, onAbortGameCallback, winner}

}