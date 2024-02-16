const { ipcRenderer } = require('electron');

const controller = {
  quicksave: () => {
    return ipcRenderer.send('quicksave')
  },
  quickload: () => {
    return ipcRenderer.send('quickload')
  },
  save: (name) => {
    return ipcRenderer.send('save', name)
  },
  load: (name) => {
    return ipcRenderer.send('load', name)
  },
  saveSettings: (data) => {
    ipcRenderer.send('save-settings', data)
  },
  loadSettings: async (data) => {
    return ipcRenderer.invoke('load-settings', data)
  },
  getSaves: async () => {
    return ipcRenderer.invoke('get-saves');
  }
}

module.exports = controller;