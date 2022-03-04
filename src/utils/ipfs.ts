const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export const isIPFS = (uri?: string) => {
    if (uri) {
        return uri.startsWith('ipfs://');
    } else {
        return false;
    }

};


/**
 * Check first if is ipfs path
 * @param ipfsPath 
 */
export const getPublicIPFSPath = (ipfsUri: string) => {

    const ipfs_hash = ipfsUri.substring(
        6,
        ipfsUri.length,
    );

    return `${IPFS_GATEWAY}/${ipfs_hash}`;


}