const path = require('node:path');
const fs = require('node:fs');

const pathToNewDir = path.join(__dirname, 'files-copy');

fs.mkdir(pathToNewDir, {recursive: true}, (err) => {
  if (err) throw err;
  fs.copyFile
});

