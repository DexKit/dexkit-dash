import {getCachedMagicNetwork, getMagic, magicStorage} from '.';

export const getEmailConnector = async (email: string) => {
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
      await magic.auth.loginWithMagicLink({
        email,
        showUI: true,
        redirectURI: `${window.location.origin}/magic/callback`,
      });

      return magic.rpcProvider;
    }
  } catch (e) {
    localStorage.setItem(magicStorage, 'false');
  }

  return magic.rpcProvider;
};
