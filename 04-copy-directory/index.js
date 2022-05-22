const path = require('node:path');
const fs = require('node:fs');

const pathToSourceDir = path.resolve(__dirname, 'files');
const pathToDestDir = path.resolve(__dirname, 'files-copy');

const removeDir = (source, dest) => {
  fs.rm(dest, {force: true, recursive: true}, (err) => {
    if (err) throw err;
    createDir(source, dest);
  });
};

const createDir = (source, dest) => {
  fs.mkdir(dest, {recursive: true}, (err) => {
    if (err) throw err;
    readDir(source, dest);
  });
};

const readDir = (source, dest) => {
  fs.readdir(source, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(el => {
      let newSource = path.join(source, el.name);
      let newDest = path.join(dest, el.name);
      if (el.isFile()) {
        copyFile(newSource, newDest);
      } else if (el.isDirectory()) {
        copyDir(newSource, newDest);
      }
    });
  });
};

const copyFile = (source, dest) => {
  fs.copyFile(source, dest, (err) => {
    if (err) throw err;
  });
};

const copyDir = (source, dest) => {
  removeDir(source, dest);
};

copyDir(pathToSourceDir, pathToDestDir);