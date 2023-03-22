# React Cache Buster

[![NPM](https://img.shields.io/npm/v/react-cache-buster.svg)](https://www.npmjs.com/package/react-cache-buster)
[![BundlePhobia](https://img.badgesize.io/https:/cdn.jsdelivr.net/npm/react-cache-buster?compression=gzip)](https://bundlephobia.com/package/react-cache-buster)

### About the Package

This package allows clients to automatically check the new version when a new version is released in the production environment, and if a new version is published, clearing the cache and reload the page. You can find an example project under the example folder.

### Installation

```bash
npm install react-cache-buster

#or

yarn add react-cache-buster
```

### Usage

Add a new script to package.json

```bash
"scripts": {
  #...
  "generate-meta-tag": "node ./node_modules/react-cache-buster/dist/generate-meta-tag.js"
  #...
}
```

And then, change your build script like below;

```bash
"scripts": {
  "build": "yarn generate-meta-tag && react-scripts build"

  #or

  "build": "npm run generate-meta-tag && react-scripts build"
}
```

The `generate-meta-tag` script command creates a file named `meta.json` under the public folder under the root directory of your project and writes the current package.json version into the created file.

```jsx
import React from 'react';
import CacheBuster from 'react-cache-buster';
import { version } from '../package.json';
import Loading from './loading';

const App = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return (
    <CacheBuster
      currentVersion={version}
      isEnabled={isProduction} //If false, the library is disabled.
      isVerboseMode={false} //If true, the library writes verbose logs to console.
      loadingComponent={<Loading />} //If not pass, nothing appears at the time of new version check.
      metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
    >

      // Your actual root component...

    </CacheBuster>
  );
};

export default App;
```

You can now build and go on production as before.

The process works as follows;

- When you run the build script, the `generate-meta-tag` script writes the current package.json version into meta.json and then the build process continues.
- When the client opens the website, the CacheBuster component makes a request to the `/meta.json` file located in the root.
- Although the website is initially loaded via cache, the updated version data is obtained through the request since XHR requests are not kept in the cache.
- Then, the current version of the cached project is compared with the version received over the request.
- If it is understood that a new version has been published as a result of this comparison, the whole cache is deleted and the project is reloaded.

### Props

| Props             | Type     | Required           | Description                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children          | JSX      | :white_check_mark: | Must be your actual root component. If you don't need to clear the cache, React Cache Buster renders the actual component.                                                                                                                                                                                                                                               |
| currentVersion    | String   | :white_check_mark: | Point to the package.json version inside your project.                                                                                                                                                                                                                                                                                                                   |
| isEnabled         | Boolean  | :white_check_mark: | Enable/disable React Cache Buster. Default: **false**                                                                                                                                                                                                                                                                                                                    |
| isVerboseMode     | Boolean  | :x:                | If true, React Cache Buster writes verbose logs to console. Default: **false**                                                                                                                                                                                                                                                                                           |
| loadingComponent  | JSX      | :x:                | Component to be rendered during the new version control.                                                                                                                                                                                                                                                                                                                 |
| metaFileDirectory | String   | :x:                | If public assets are hosted somewhere other than root on your server, you can pass the directory with this prop.                                                                                                                                                                                                                                                         |
| reloadOnDowngrade | Boolean  | :x:                | Whether to also bust the cache and reload if the version fetched from the server is lower. Default: **false**                                                                                                                                                                                                                                                            |
| onCacheClear      | Function | :x:                | This function is called before clearing the cache when a new version is found. If you pass this prop, cache clearing is not performed. Instead, the cache clearing function is sent as a parameter to this function and **you are expected to call this function**.<br/>Structure of the function: `onCacheClear: (refreshCacheAndReload: () => Promise<void>) => void;` |

### Check for new version manually

From any component child of the `<CacheBuster>` provider, you can use the `useCacheBuster` hook to get the `checkCacheStatus` function and trigger a version check and possible cache bust whenever you want, such as on any route change (be mindful of when this can interrupt your user's experience). When you call the `checkCacheStatus` function, if there is a new version, this method will be called if you have given the `onCacheClear` prop to CacheBuster, otherwise the page will be refreshed automatically. See [example](example/) for a simple use case.

```jsx
const VersionCheckButton = () => {
  const { checkCacheStatus } = useCacheBuster();

  return <button onClick={checkCacheStatus}>Check for new version</button>;
};
```

### License

MIT © [CagriAldemir](https://github.com/CagriAldemir)
