import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compare } from 'compare-versions';

function CacheBuster({
  children = null,
  currentVersion,
  isEnabled = false,
  isVerboseMode = false,
  loadingComponent = null
}) {
  const [cacheStatus, setCacheStatus] = useState({
    loading: true,
    isLatestVersion: false
  });

  const log = (message, isError) => {
    isVerboseMode && (isError ? console.error(message) : console.log(message));
  };

  useEffect(() => {
    isEnabled ? checkCacheStatus() : log('React Cache Buster is disabled.');
  }, []);

  const checkCacheStatus = async () => {
    try {
      const res = await fetch('/meta.json');
      const { version: metaVersion } = await res.json();

      const shouldForceRefresh = isThereNewVersion(metaVersion, currentVersion);
      if (shouldForceRefresh) {
        log(`There is a new version (v${metaVersion}). Should force refresh.`);
        setCacheStatus({
          loading: false,
          isLatestVersion: false
        });
      } else {
        log('There is no new version. No cache refresh needed.');
        setCacheStatus({
          loading: false,
          isLatestVersion: true
        });
      }
    } catch (error) {
      log('An error occurred while checking cache status.', true);
      log(error, true);

      //Since there is an error, if isVerboseMode is false, the component is configured as if it has the latest version.
      !isVerboseMode &&
        setCacheStatus({
          loading: false,
          isLatestVersion: true
        });
    }
  };

  const isThereNewVersion = (metaVersion, currentVersion) => {
    return compare(metaVersion, currentVersion, '>');
  };

  const refreshCacheAndReload = async () => {
    try {
      if (window?.caches) {
        const { caches } = window;
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          caches.delete(cacheName);
        }
        log('The cache has been deleted.');
        window.location.reload(true);
      }
    } catch (error) {
      log('An error occurred while deleting the cache.', true);
      log(error, true);
    }
  };

  if (!isEnabled) {
    return children;
  } else {
    if (cacheStatus.loading) {
      return loadingComponent;
    }

    if (!cacheStatus.loading && !cacheStatus.isLatestVersion) {
      refreshCacheAndReload();
      return null;
    }
    return children;
  }
}

CacheBuster.propTypes = {
  children: PropTypes.element.isRequired,
  currentVersion: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isVerboseMode: PropTypes.bool,
  loadingComponent: PropTypes.element
};

export { CacheBuster };
