const submit = document.getElementById('submit');
const setupType = document.getElementById('setup');
const mysqldumpPath = document.getElementById('mysqldumpPath');
const mysqldumpPathPicker = document.getElementById('mysqldumpPathPicker');
const mysqlPath = document.getElementById('mysqlPath');
const mysqlPathPicker = document.getElementById('mysqlPathPicker');
const username = document.getElementById('username');
const wsl = document.getElementById('wsl');

controller.loadSettings().then(
  (settings) => {
    mysqlPath.value = settings.mysqlPath;
    mysqldumpPath.value = settings.mysqldumpPath;
    username.value = settings.username;
    setup.value = settings.setup;
    wsl.checked = settings.wsl;
  }
)

submit.addEventListener('click', saveSettings);
mysqldumpPathPicker.addEventListener('change', (e) => {
  mysqldumpPath.value = e.target.files[0].path;
});
mysqlPathPicker.addEventListener('change', (e) => {
  mysqlPath.value = e.target.files[0].path;
});

function saveSettings() {
  const settings = {
    'mysqlPath': mysqlPath.value,
    'mysqldumpPath': mysqldumpPath.value,
    'username': username.value,
    'setup': setupType.value,
    'wsl': wsl.checked,
  }
  controller.saveSettings(settings)
}
