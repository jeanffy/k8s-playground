const fs = require('fs');
const os = require('os');
const path = require('path');

function init() {
  const folderPath = path.join(os.tmpdir(), 'nodulapp');
  console.log(`Connecting to folder '${folderPath}'`);
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
}

function getList(folderPath) {
  return fs.readdirSync(folderPath);
}

function writeNew(folderPath, alea) {
  const filePath = path.join(folderPath, alea);
  fs.writeFileSync(filePath, alea);
  return filePath;
}

module.exports = {
  init: init,
  getList: getList,
  writeNew: writeNew
}
