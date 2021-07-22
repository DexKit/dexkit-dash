
import crypto from 'crypto';


const CHANGELY_ENDPOINT  = 'https://api.changelly.com';
const API_SECRET = '6ef24f47fbe4c5470c8ea6e28337bb0274efa197a8ce0ed5ccc74e7fde01444d';
const API_KEY = '3e73439f8c7747a8b8b323f9db05c7f1';

let id: string; 
const getId = () => {
    if(!id){
        id =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }
    return id;


}

const signMessage = (message: string) => {
    return crypto
    .createHmac('sha512', API_SECRET)
    .update(message)
    .digest('hex');
}

const request = (method: string, params: any) => {
    const body = {
        id: getId(),
        jsonrpc : '2.0',
        method: method,
        params, 
    }
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('api-key', API_KEY);
    headers.set('sign', signMessage(JSON.stringify(body)));
   

    const requestInit: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
        
    }
    return fetch(CHANGELY_ENDPOINT, requestInit).then(r=> r.json());
}  

/*
TODO: socket connection;
const socketConnection;
const ChangellyWebsocket = () => {
    if(!socketConnection){

    }


}*/




export const Changelly = {
    getCurrencies(){
        return request('getCurrencies', {})
    },
    getCurrenciesFull(){
        return request('getCurrenciesFull', {})
    },
    getMinAmount(params: {from: string, to: string}){
        return request('getMinAmount', params);
    },
    getExchangeAmount(params: {from: string, to: string, amount: string}){
        return request('getExchangeAmount', params);
    },
    validateAddress(params: {currency: string, address: string}){
        return request('validateAddress', params);
    },
    createTransaction(params: {from: string, to: string, address: string, amount: string}){
        return request('createTransaction', params);
    },
    //Returns status of a given transaction using a transaction ID provided.
    getStatus(id: string){
        return request('getStatus', {id});
    },
     // Returns an array of all transactions or a filtered list of transactions.
     getTransactions(params: {limit?: string, offset?: string, currency?: string, address?: string, extraId?: string}){
        return request('getTransactions', params);
    },
}