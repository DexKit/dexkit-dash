import { ConfigResponse } from 'types/myApps';
import { ConfigDomainResponse } from '../utils/types';

//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';
const MY_APPS_ENDPOINT = 'http://localhost:3005';

export const sendConfig = async (formData: any) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
    };

    const url = `${MY_APPS_ENDPOINT}/v4/config`;
    const response = await fetch(url, init);
    if (response.ok && response.status === 200) {
        const data = (await response.json()) as ConfigResponse;
        return data;
    } else {
        const data = await response.text();
        throw Error(data);
    }
};


export const setupDomainConfig = async (formData: any) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
    };

    const url = `${MY_APPS_ENDPOINT}/v4/setup-domain`;
    const response = await fetch(url, init);
    if (response.ok && response.status === 200) {
        const data = (await response.json()) as ConfigDomainResponse;
        return data;
    } else {
        const data = await response.text();
        throw Error(data);
    }
};

export const getConfig = async (owner: string) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };

    const url = `${MY_APPS_ENDPOINT}/v4/config/${owner}`;
    const response = await fetch(url, init);

    if (response.ok && response.status === 200) {
        const data = (await response.json()) as ConfigResponse[];
        return data;
    } else {
        return [];
    }
};

export const deleteConfig = async (formData: any, owner: string, domain: string) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'DELETE',
        headers,
        body: JSON.stringify(formData),
    };

    const url = `${MY_APPS_ENDPOINT}/v4/config/${owner}?domain=${domain}`;
    const response = await fetch(url, init);

    if (response.ok && response.status === 200) {
        const data = (await response.json()) as ConfigResponse[];
        return data;
    } else {
        return [];
    }
};

export const getDomainConfigStatus = async (domain: string) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };

    const url = `${MY_APPS_ENDPOINT}/v4/domain-status?domain=${domain}`;
    const response = await fetch(url, init);

    if (response.ok && response.status === 200) {
        const data = (await response.json()) as ConfigResponse;
        return data;
    } else {
        return [];
    }
};

