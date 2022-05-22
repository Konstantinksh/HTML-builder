const path = require('node:path');
const fs = require('node:fs');

const pathToSourceDir = path.resolve(__dirname, 'styles');
const pathToDestDir = path.resolve(__dirname, 'project-dist', 'bundle.css');
const writeableStream = fs.createWriteStream(pathToDestDir, 'utf-8');

const bundleCSS = (src) => {
  readDir(src);
};

const readDir = (src) => {
  fs.readdir(src, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(el => {
      if (el.isFile() && (path.extname(el.name) === '.css')) {
        const currentFile = path.join(src, el.name);
        readCurrentFile(currentFile);
      }
    });
  });
};

const readCurrentFile = (file) => {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    writeToDest(data);
  });
};

const writeToDest = (data) => {
  writeableStream.write(`${data}\n`);
};

bundleCSS(pathToSourceDir);