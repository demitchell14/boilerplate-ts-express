const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();

const envFile = path.join(BASE_DIR, '.env');
const defaultEnv = path.join(BASE_DIR, '.env.default');

function nextEnv() {
    const difference = {};
    const defaultEnv = config({ path: '.env.default' })?.parsed;
    const currentEnv = config({ path: '.env' })?.parsed;

    Object.keys(defaultEnv).map(key => {
        if (typeof currentEnv[key] === 'undefined') {
            difference[key] = defaultEnv[key]
        }
    })

    if (Object.keys(difference).length > 0) {
        Object.keys(difference).map(key => currentEnv[key] = difference[key]);
        return currentEnv;
    }
    return null;
}

function map(args) {
    const lines = [];
    Object.keys(args).map(key => {
        lines.push(`${key}=${args[key]}`);
    })
    return lines.join('\r\n');
}


if (!fs.existsSync(envFile) && fs.existsSync(defaultEnv)) {
    fs.copyFileSync(defaultEnv, envFile);
}

const envToSave = nextEnv();
if (envToSave) {
    fs.writeFileSync(envFile, map(envToSave));
}