const { readFileSync, existsSync } = require("original-fs");
const { homedir } = require('node:os');

const rootDir = homedir() + '/quicksave/';
const dataDir = rootDir + 'saves/';
const settingsPath = rootDir + 'settings.json';

const getSettings = () => {
  const defaults = {
    mysqlPath: 'mysql',
    mysqldumpPath: 'mysqldump',
    username: 'root',
  };

  if (!existsSync(settingsPath)) {
    return defaults;
  }

  return { ...defaults, ...JSON.parse(readFileSync(settingsPath)) };
}

const utils = {
  rootDir,
  dataDir,
  settingsPath,
  getSettings
}

module.exports = utils;