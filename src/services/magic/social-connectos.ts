import {getCachedMagicNetwork, getMagic, magicStorage} from '.';

export type SupportSocialConnectors =
  | 'google'
  | 'twitter'
  | 'discord'
  | 'apple';

export const getSocialConnector = async (provider: SupportSocialConnectors) => {
  const network = getCachedMagicNetwork();
  const magic = getMagic(network);
  await magic.preload();
  let isLogged;
  const tryLogin = localStorage.getItem(magicStorage);
  try {
    if (tryLogin === 'true') {
      isLogged = await magic.user.isLoggedIn();
      if (isLogged) {
        return magic.rpcProvider;
      }
    }
  } catch (e) {}
  try {
    if (tryLogin === 'false') {
      localStorage.setItem(magicStorage, 'true');
      await magic.oauth.loginWithRedirect({
        provider: provider /* 'google', 'facebook', 'apple', or 'github' */,
        // TODO: When production use main site
        redirectURI: `${window.location.origin}/magic/callback-social`,
      });

      return magic.rpcProvider;
    }
  } catch (e) {
    localStorage.setItem(magicStorage, 'false');
  }

  return magic.rpcProvider;
};
