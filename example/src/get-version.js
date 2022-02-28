import React, { useEffect, useState } from 'react';
import { version } from '../package.json';

function GetVersion({ propertyToCheck }) {
  const [meta, setMeta] = useState('');

  const getMeta = async (prop) => {
    const res = await fetch('/meta.json?r=' + Math.random());
    const packageJson = await res.json();
    const gotMeta = packageJson[prop];
    setMeta(gotMeta);
  };

  useEffect(() => {
    getMeta(propertyToCheck);
  })

  return <div className='small-text'>Last Build {propertyToCheck}: {meta}</div>;
}

export default GetVersion;
