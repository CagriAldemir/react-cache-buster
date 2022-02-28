import React from 'react';
import CacheBuster from 'react-cache-buster';
import { version } from '../package.json';
import HomePage from './home-page';
import Loading from './loading';

const App = () => {
  const propertyToCheck = 'hash';
  // const propertyToCheck = 'version';
  const hashVal = process.env.REACT_APP_COMMIT_HASH;
  console.log(`this is the hashval [${hashVal}]`);
  return (
    <CacheBuster
      currentValue={hashVal}
      isEnabled={true}
      isVerboseMode={true}
      propertyToCheck={propertyToCheck}
      loadingComponent={<Loading />}
    >
      <HomePage />
    </CacheBuster>
  );
};

export default App;
