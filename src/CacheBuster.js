// @ts-check
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import { compare } from 'compare-versions';

const CacheBusterContext = createContext({ checkCacheStatus: () => {} });

function CacheBuster({
  children = null,
  currentVersion,
  isEnabled = false,
  isVerboseMode = false,
  loadingComponent = null,
  metaFileDirectory = null,
  reloadOnDowngrade = false,
  onCacheClear
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

  const getMetaFileDirectory = () => {
    return !metaFileDirectory || metaFileDirectory === '.'
      ? ''
      : metaFileDirectory;
  };

  const checkCacheStatus = useCallback(async () => {
    try {
      const res = await fetch(`${getMetaFileDirectory()}/meta.json?nonce=${Date.now()}`);
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
  }, [currentVersion, isVerboseMode, metaFileDirectory]);

  const isThereNewVersion = (metaVersion, currentVersion) => {
    if (reloadOnDowngrade) {
      return !compare(metaVersion, currentVersion, '=');
    }
    return compare(metaVersion, currentVersion, '>');
  };

  const refreshCacheAndReload = async () => {
    try {
      if (window?.caches) {
        const { caches } = window;
        const cacheNames = await caches.keys();
        const cacheDeletionPromises = cacheNames.map((n) => caches.delete(n));

        await Promise.all(cacheDeletionPromises);

        log('The cache has been deleted.');
        // @ts-ignore: Firefox still has a `forceReload` parameter.
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
      if (onCacheClear) {
        onCacheClear(refreshCacheAndReload);
      } else {
        refreshCacheAndReload();
      }
      return null;
    }

    return React.createElement(
      CacheBusterContext.Provider,
      {
        value: { checkCacheStatus }
      },
      children
    );
  }
}

CacheBuster.propTypes = {
  children: PropTypes.element.isRequired,
  currentVersion: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isVerboseMode: PropTypes.bool,
  loadingComponent: PropTypes.element,
  metaFileDirectory: PropTypes.string,
  onCacheClear: PropTypes.func
};

const useCacheBuster = () => {
  const context = useContext(CacheBusterContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useCacheBuster must be used within a CacheBuster component.'
    );
  }
  return context;
};

export { CacheBuster, useCacheBuster };
