const { writeFile } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

/**
 * Generate a git-based version for cache busting
 * Uses git commit hash directly for simplicity
 */
function generateGitVersion() {
    try {
        // Get git commit hash (short)
        const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        return gitHash;
    } catch (error) {
        console.warn('⚠️  Could not get git hash, falling back to timestamp');
        const timestamp = Date.now().toString();
        return `build-${timestamp}`;
    }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        publicPath: 'public',
        useGitVersion: false,
        version: null
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--git' || arg === '--git-version') {
            options.useGitVersion = true;
        } else if (arg === '--version' && i + 1 < args.length) {
            options.version = args[i + 1];
            i++; // Skip next argument as it's the version value
        } else if (!arg.startsWith('--')) {
            // First non-option argument is the public path
            options.publicPath = arg;
        }
    }
    
    return options;
}

/**
 * Generate meta.json with version info
 */
function generateMetaJson() {
    const options = parseArgs();
    const metaJson = path.join(process.cwd(), options.publicPath, 'meta.json');
    
    let appVersion;
    let versionSource;
    
    if (options.version) {
        // Use explicitly provided version
        appVersion = options.version;
        versionSource = 'explicit';
    } else if (options.useGitVersion) {
        // Use git-based version
        appVersion = generateGitVersion();
        versionSource = 'git';
    } else {
        // Use package.json version (default behavior)
        const packageJson = require(`${process.cwd()}/package.json`);
        appVersion = packageJson.version;
        versionSource = 'package.json';
    }
    
    let gitHash = 'unknown';
    if (options.useGitVersion || versionSource === 'git') {
        try {
            gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            console.warn('⚠️  Could not get git hash for meta.json');
        }
    }
    
    const jsonData = {
        version: appVersion,
        buildTime: new Date().toISOString(),
        versionSource: versionSource,
        ...(gitHash !== 'unknown' && { gitHash })
    };
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
    writeFile(metaJson, jsonContent, 'utf8', function (err) {
        if (err) {
            console.error('An error occurred while writing JSON Object to meta.json');
            throw console.error(err);
        } else {
            console.log(`✅ meta.json file has been saved with ${versionSource} version: ${appVersion}`);
        }
    });
}

// If called directly
if (require.main === module) {
    generateMetaJson();
}

module.exports = { generateGitVersion, generateMetaJson };
