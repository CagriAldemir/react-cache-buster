const { writeFile } = require('fs');

const path = require('path');
const packageJson = require(`${process.cwd()}/package.json`);
const metaJson = path.join(process.cwd(), 'public', 'meta.json');

const appVersion = packageJson.version;
const revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const jsonData = {
  version: appVersion, 
  hash: revision
};

const jsonContent = JSON.stringify(jsonData);

writeFile(metaJson, jsonContent, 'utf8', function (err) {
  if (err) {
    console.error('An error occurred while writing JSON Object to meta.json');
    throw console.error(err);
  } else {
    console.log(`meta.json file has been saved with v${appVersion}`);
  }
});
