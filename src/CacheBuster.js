import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compare } from 'compare-versions';

function CacheBuster({
  children = null,
  currentValue,
  propertyToCheck,
  isEnabled = false,
  isVerboseMode = false,
  loadingComponent = null,
  onCacheClear
}) {
  if (!currentValue) {
    currentValue = 'notfound';
  }
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
      const res = await fetch('/meta.json?r=' + Math.random());
      const metaJson = await res.json();
      const metaValue = metaJson[propertyToCheck];

      // Log what the cachebuster is seeing and checking
      console.log(`Cache Buster is examining the property: ${propertyToCheck}`);
      console.log(
        `Current ${propertyToCheck}: ${currentValue}, meta ${propertyToCheck}: ${metaValue}`
      );

      // Now, if the system DOES need a refresh and we haven't been here befoe, go ahead and clear the cache and perform the update
      const shouldForceRefresh = isThereNewVersion(metaValue, currentValue);
      if (shouldForceRefresh) {
        // Now, check if we've already been here.  If so, your configuration might not be quite right (values you're comparing aren't being updated properly by your build)
        const ssName = 'reloadRequest';
        const beenHereBefore = sessionStorage.getItem(ssName);
        if (beenHereBefore) {
          console.warn('CacheBuster: Refresh has already run once...cancelling to avoid infinite loop.  Please check your comparison values.');
          sessionStorage.removeItem(ssName);
          setCacheStatus({
            loading: false,
            isLatestVersion: true
          });
          return;
        } else {
          // If we haven't been here before, drop something into the session storage so we can check in case we get pushed in here again.
          sessionStorage.setItem(ssName, true);
        }

        log(
          `There is a new ${propertyToCheck} (v${metaValue}). Should force refresh.`
        );
        setCacheStatus({
          loading: false,
          isLatestVersion: false
        });
      } else {
        log(`There is no new ${propertyToCheck}. No cache refresh needed.`);
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

  const isThereNewVersion = (metaVal, currentVal) => {
    return metaVal !== currentVal;
    // return compare(metaVal, currentVal, '>');
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
      onCacheClear && onCacheClear();
      refreshCacheAndReload();
      return null;
    }
    return children;
  }
}

CacheBuster.propTypes = {
  children: PropTypes.element.isRequired,
  currentValue: PropTypes.string.isRequired,
  propertyToCheck: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isVerboseMode: PropTypes.bool,
  loadingComponent: PropTypes.element,
  onCacheClear: PropTypes.func
};

export { CacheBuster };
