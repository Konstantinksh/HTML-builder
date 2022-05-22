const path = require('node:path');
const fs = require('node:fs');

const pathToAssetsDir = path.resolve(__dirname, 'assets');
const pathToComponentsDir = path.resolve(__dirname, 'components');
const pathToStylesDir = path.resolve(__dirname, 'styles');
const pathToHTML = path.resolve(__dirname, 'template.html');
const pathToDestDir = path.resolve(__dirname, 'project-dist');

const pathToDestCss = path.resolve(pathToDestDir, 'style.css');
const writeableStreamCSS = fs.createWriteStream(pathToDestCss, 'utf-8');

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
    // bundleCSS(pathToStylesDir);
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



const bundleCSS = (src) => {
  readCSSFiles(src);
};

const readCSSFiles = (src) => {
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
  writeableStreamCSS.write(`${data}\n`);
};

const buildPage = () => {
  copyDir(pathToAssetsDir, path.join(pathToDestDir, 'assets')); //copy assets  
};

buildPage();