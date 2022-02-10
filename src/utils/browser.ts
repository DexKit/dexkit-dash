export function getWindowUrl() {
  let protocol = window.location.protocol;
  let hostname = window.location.hostname;
  let port = window.location.port;

  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

export function isValidURL(url: string): boolean {
  /* eslint-disable */
  var res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

// return a promise
export function copyToClipboard(textToCopy: string) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res(null) : rej();
      textArea.remove();
    });
  }
}

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export function isIpfsUrl(url: string) {
  return url.startsWith('ipfs://');
}

export function getNormalizedUrl(url: string) {
  let fetchUrl = url;

  if (isIpfsUrl(url)) {
    let path = url.substring(6, url.length);
    fetchUrl = `${IPFS_GATEWAY}${path}`;
  }

  return fetchUrl;
}

export function isMetamaskWallet() {
  if (
    typeof window !== 'undefined' &&
    window?.ethereum &&
    typeof window?.ethereum?.isMetamask !== 'undefined'
  ) {
    return window.ethereum.isMetamask;
  }

  return false;
}

export function isTrustWallet() {
  if (
    typeof window !== 'undefined' &&
    window?.ethereum &&
    typeof window?.ethereum?.isTrust !== 'undefined'
  ) {
    return window.ethereum.isTrust;
  }

  return false;
}
