import CacheBuster from './CacheBuster';
import generateMetaTag from './generate-meta-tag';

const args = process.argv.slice(2);
if (args[0] === '--generate' || args[0] === '-g') {
  generateMetaTag();
}

export default CacheBuster;
