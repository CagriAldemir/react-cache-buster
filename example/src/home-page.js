import React from 'react';
import { version } from '../package.json'; 
import GetVersion from './get-version';

function HomePage() {
  const propertyToCheck = 'hash';
  const hashVal = process.env.REACT_APP_COMMIT_HASH;
  return (
    <div className="container">
      <div className="home-text">
        <div>Hi !</div>
        <div>
          I'm <strong>React Cache Buster: Current {propertyToCheck}={hashVal} </strong>
        </div>
        <GetVersion propertyToCheck={'hash'} />
      </div>
      <div className="footer">
        <a
          href="https://twitter.com/CagriAldemir"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <img alt="logo" src="/twitter.png" />
        </a>
        <a
          href="https://github.com/CagriAldemir"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <img alt="logo" src="/github.png" />
        </a>
      </div>
    </div>
  );
}

export default HomePage;
