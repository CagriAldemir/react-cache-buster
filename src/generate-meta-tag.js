const { writeFile } = require('fs');

const path = require('path');
const packageJson = require(`${process.cwd()}/package.json`);
const metaJson = path.join(process.cwd(), 'public', 'meta.json');

let appVersion = 'no-version-found';
let gitHash = 'no-git-hash-found';
try{
  appVersion = packageJson.version;
  gitHash = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim();
}
catch(ex){ }

const jsonData = {
  version: appVersion, 
  hash: gitHash
};

const jsonContent = JSON.stringify(jsonData);

writeFile(metaJson, jsonContent, 'utf8', function (err) {
  if (err) {
    console.error(
      'CacheBuster: An error occurred while writing JSON Object to meta.json'
    );
    throw console.error(err);
  } else {
    console.log(`CacheBuster: meta.json file has been saved with v${appVersion} and gitHash: ${gitHash}`);
  }
});
