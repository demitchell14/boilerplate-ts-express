// used for pm2
const { config: dotenv } = require('dotenv');
const path = require('path');
const pkg = require('./package.json');

const env = dotenv().parsed;
const cwd = process.cwd();

const exporter = {
    apps: [
        {
            cwd,
            name: `${pkg.name.substr(0, 10)} V${pkg.version}`,
            script: path.join(cwd, pkg.main),
            env,
            env_production: env,
        }
    ]
};

module.exports = exporter;