import React, {useEffect} from 'react';
import packageJson from '../../../../package.json';

// Reference: https://dev.to/flexdinesh/cache-busting-a-react-app-22lk

// version from `meta.json` - first param
// version in bundle file - second param
const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

const CacheBuster = () => {
  useEffect(() => {
    fetch('/meta.json')
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = packageJson.version;

        const shouldForceRefresh = semverGreaterThan(
          latestVersion,
          currentVersion,
        );
        if (shouldForceRefresh) {
          console.log(
            `We have a new version - ${latestVersion}. Should force refresh`,
          );
          if (caches) {
            // Service worker cache should be cleared with caches.delete()
            caches.keys().then(function (names) {
              for (let name of names) caches.delete(name);
            });
          }
          // delete browser cache and hard reload
          window.location.reload();
        } else {
          console.log(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
        }
      });
  });
  return <></>;
};

export default CacheBuster;
