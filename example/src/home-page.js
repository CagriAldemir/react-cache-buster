import React from 'react';

function HomePage() {
  return (
    <div className="container">
      <div className="home-text">
        <div>Hi !</div>
        <div>
          I'm <strong>React Cache Buster</strong>
        </div>
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
