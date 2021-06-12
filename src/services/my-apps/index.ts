import { ConfigResponse } from "types/myApps";

const MY_APPS_ENDPOINT = 'https://query.dexkit.com'

export const sendConfig = async (formData: any) => {
  const headers = new Headers({
    'content-type': 'application/json',
  });

  const init: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(formData),
  }

  console.log('POST DATA', init);

  const url = `${MY_APPS_ENDPOINT}/v4/config`;
  return await fetch(url, init)
}

export const getConfig = async (owner: string) => {
  const headers = new Headers({
    'content-type': 'application/json',
  });

  const init: RequestInit = {
    method: 'GET',
    headers,
  }

  const url = `${MY_APPS_ENDPOINT}/v4/config/${owner}`;
  const response =  await fetch(url, init);

  if(response.ok && response.status === 200){
    const data = await response.json() as ConfigResponse[];
    return data;
  }else{
    return [];
  }
}