const quicksave = document.getElementById('quicksave');
const quickload = document.getElementById('quickload');
const loadingCover = document.getElementById('loading-cover');
const saveName = document.getElementById('save-name');
const save = document.getElementById('save');
const saveList = document.getElementById('save-list');
const listChildren = [];

import "./index.css";


function disableButtons() {
  loadingCover.hidden = false;
  quickload.setAttribute('disabled', true);
  quicksave.setAttribute('disabled', true);
  save.setAttribute('disabled', true);
  listChildren.map((child) => child.setAttribute('disabled', true));
}

function enableButtons() {
  loadingCover.hidden = true;
  quickload.removeAttribute('disabled');
  quicksave.removeAttribute('disabled');
  save.removeAttribute('disabled');
  listChildren.map((child) => child.removeAttribute('disabled'));
  renderSaves();
}

quicksave.addEventListener('click', () => {
  disableButtons();
  window.controller.quicksave();
});

quickload.addEventListener('click', () => {
  disableButtons();
  window.controller.quickload();
});

save.addEventListener('click', () => {
  disableButtons();
  window.controller.save(saveName.value);
});

function renderSaves() {
  listChildren.map((child) => child.remove());
  window.controller.getSaves().then((saves) => {
    saves.map((save) => {
      const listItem = document.createElement('li');
      listChildren.push(listItem);
      listItem.innerText = save;
      listItem.id = save;
      listItem.addEventListener('click', (e) => {
        disableButtons();
        console.log(save);

        window.controller.load(save)
      });
      saveList.append(listItem);
    })
  });
}
window.renderer.setLoad((value) => {
  if (value === false) {
    enableButtons();
    loadingCover.innerText = 'Loading...';
  } else {
    disableButtons();
    loadingCover.innerText = value;
  }
});
renderSaves();

