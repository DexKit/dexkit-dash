import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { BITBOY_TEAM, CREATOR_ADDRESSES } from "../constants";

export const isGameCreator = (address?: string) => {
    if(!address){
        return false;
    }
    return CREATOR_ADDRESSES.map(a => a.toLowerCase()).includes(address.toLowerCase());
}

export const GET_BITBOY_NAME = (address?: string) => {
    if(!address){
        return false;
    }
    return BITBOY_TEAM.find(a => a.address.toLowerCase() === address.toLowerCase());
    
}

export const GET_GAME_LEVEL = (entry: BigNumber) => {


    if(entry.lt(ethers.utils.parseEther('5'))){
        return 'Beginner'
    }else if(entry.lt(ethers.utils.parseEther('10'))){
        return 'Intermediate'
    }else if(entry.lt(ethers.utils.parseEther('50'))){
        return 'Advanced'
    }else if(entry.lt(ethers.utils.parseEther('100'))){
        return 'Expert'
    }else if(entry.lt(ethers.utils.parseEther('500'))){
        return 'Master'
    }else{
        return 'Grand Master'
    }

    
} 