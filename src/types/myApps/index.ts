
export type  WhitelabelTypes =  'DEX' | 'MARKETPLACE' | 'AGGREGATOR'


export interface ConfigResponse {
    slug: string,
    config: any,
    domain: string,
    type: WhitelabelTypes,
}

