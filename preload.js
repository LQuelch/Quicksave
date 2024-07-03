const { contextBridge } = require('electron/renderer')
const controller = require('./src/api/controller');
const { ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('controller', controller);
contextBridge.exposeInMainWorld('renderer', {
  setLoad: (callback) => ipcRenderer.on('set-load', (e, value) => callback(value)),
});
