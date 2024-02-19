const { ipcMain, BrowserWindow, app } = require('electron')
const { dialog } = require('electron');
const { mkdir, existsSync, writeFile, readdirSync } = require('node:fs');
const mysql = require('./mysql');
const utils = require('./utils');

if (require('electron-squirrel-startup')) app.quit();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 350,
    height: 350,
    minWidth: 350,
    minHeight: 350,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false
    }
  })

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  ipcMain.on('quicksave', () => {
    mysql.dump(win, utils.dataDir + 'quicksave.sql');
  })

  ipcMain.on('quickload', () => {
    mysql.restore(win, utils.dataDir + 'quicksave.sql');
  })

  ipcMain.on('save', (e, name) => {
    if (!name.endsWith('.sql')) {
      name += '.sql';
    }

    if (existsSync(utils.dataDir + name)) {
      dialog.showErrorBox('File Exists', 'A save with the name "' + name + '" already exists');
      win.webContents.send('set-load', false);
      return;
    }

    mysql.dump(win, utils.dataDir + name);
  })

  ipcMain.on('load', (e, name) => {
    if (!name) {
      win.webContents.send('set-load', false);
      return;
    }

    const response = dialog.showMessageBox(win, {
      title: 'Load save',
      message: 'Are you sure you want to import: ' + name + '?',
      noLink: true,
      buttons: ['Yes', 'No']
    });

    response.then((value) => {
      console.log(value);
      if (value.response === 0) {
        mysql.restore(win, utils.dataDir + name);
      } else {
        win.webContents.send('set-load', false);
      }
    });
  });



  ipcMain.on('save-settings', (e, settings) => {
    const serialised = JSON.stringify(settings);
    console.log(serialised);
    writeFile(utils.settingsPath, serialised, (err) => {
      if (err) {
        dialog.showErrorBox('Error saving settings', err.message);
      }
    });
  });

  ipcMain.handle('load-settings', utils.getSettings);

  ipcMain.handle('get-saves', () => {
    const files = readdirSync(utils.dataDir);
    const saves = files.filter(file => file != 'quicksave.sql');
    return saves;
  });

}

app.whenReady().then(() => {
  createWindow()
  if (!existsSync(utils.dataDir)) {
    mkdir(utils.dataDir, { recursive: true }, (err) => {
      if (err) {
        dialog.showErrorBox('Directory error', 'Failed to create saves directory at: ' + dataDir + '\n' + err.message);
      }
    })
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})