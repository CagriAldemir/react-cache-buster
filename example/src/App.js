import React from 'react';
import CacheBuster from 'react-cache-buster';
import { version } from '../package.json';
import HomePage from './home-page';
import Loading from './loading';

const App = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return (
    <CacheBuster
      currentVersion={version}
      isEnabled={isProduction}
      reloadOnDowngrade={false}
      isVerboseMode={true}
      loadingComponent={<Loading />}
    >
      <HomePage />
    </CacheBuster>
  );
};

export default App;
