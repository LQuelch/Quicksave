const { dialog, ipcMain, webContents } = require("electron");
const { exec } = require('node:child_process');
const utils = require('./utils');

function getMySQLDumpExe() {
  return '"' + utils.getSettings().mysqldumpPath + '"';
}

function getMySQLExe() {
  return '"' + utils.getSettings().mysqlPath + '"';
}

const mysql = {
  dump: (mainWindow, path) => {
    mainWindow.webContents.send('set-load', 'Saving dump...');

    const command = [
      getMySQLDumpExe(),
      '--result-file="' + path + '"',
      '--user="' + utils.getSettings().username + '"',
      '--protocol=tcp',
      '--column-statistics=0',
      '--skip-triggers',
      '--databases curatr_v3',
    ].join(' ');
    exec(command, (err, stdout, stderr) => {
      if (err) {
        dialog.showErrorBox('Error dumping', err.message);
      }
      mainWindow.webContents.send('set-load', false);
    })
  },
  restore: (mainWindow, path) => {
    console.log("started");

    const restoreCommand = [
      getMySQLExe(),
      '--user="' + utils.getSettings().username + '"',
      '--protocol=tcp',
      '--database=curatr_v3',
      '<',
      '"' + path + '"',
    ].join(' ');

    mainWindow.webContents.send('set-load', 'Importing dump...');

    exec(restoreCommand, (err, stdout, stderr) => {
      if (err) {
        dialog.showErrorBox('Error importing', err.message);
      }

      let migrateCommand = 'docker-compose --project-name=stream exec -u=curatr -w=/usr/local/curatr/current/api curatr php artisan migrate';

      if (utils.getSettings().setup === 'dev') {
        migrateCommand = 'docker-compose --project-name=stream-docker-dev exec -u=curatr -w=/usr/local/curatr/current/api php-8.0 php artisan migrate';
      }

      mainWindow.webContents.send('set-load', 'Running migrations...');

      const wslPrefix = utils.getSettings().wsl ? 'wsl ' : '';

      exec(wslPrefix + migrateCommand, (err, stdout, stderr) => {
        if (err) {
          dialog.showErrorBox('Error running migrations', err.message);
        }
        mainWindow.webContents.send('set-load', false);
      });
    });
  }
}

module.exports = mysql;