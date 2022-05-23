const path = require('node:path');
const fs = require('node:fs');

const pathToAssetsDir = path.resolve(__dirname, 'assets');
const pathToComponentsDir = path.resolve(__dirname, 'components');
const pathToStylesDir = path.resolve(__dirname, 'styles');
const pathToHTMLTemplate = path.resolve(__dirname, 'template.html');
const pathToDestDir = path.resolve(__dirname, 'project-dist');
const pathToDestCSS = path.resolve(pathToDestDir, 'style.css');
const pathToDestHTML = path.resolve(pathToDestDir, 'index.html');

// COPY FOLDER
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


// CSS Bundle
const bundleCSS = (src) => {  
  const writeableStreamCSS = fs.createWriteStream(pathToDestCSS, 'utf-8');
  readCSSFiles(src, writeableStreamCSS);
};

const readCSSFiles = (src, dest) => {
  fs.readdir(src, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(el => {
      if (el.isFile() && (path.extname(el.name) === '.css')) {
        const currentFile = path.join(src, el.name);
        readCurrentFile(currentFile, dest);
      }
    });
  });
};

const readCurrentFile = (file, dest) => {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    writeToDest(data, dest);
  });
};

const writeToDest = (data, dest) => {
  dest.write(`${data}\n\n`);
};

// BUNDLE HTML
const bundleHTML = () => {
  let innerHTML = '';
  const newReadStream = fs.createReadStream(pathToHTMLTemplate);

  newReadStream.on('data', data => {
    innerHTML = data.toString();
    fs.readdir(path.join(pathToComponentsDir), {withFileTypes: true}, (err, res) => {
      if (err) throw err;
      res.forEach(el => {
        if (el.isFile() && path.extname(el.name) === '.html') {
          const pathToCurrentFile = path.join(pathToComponentsDir, el.name);
          fs.readFile(pathToCurrentFile, (err, data) => {
            if (err) throw err;
            innerHTML = innerHTML.replace(`{{${el.name.slice(0, -5)}}}`, data.toString());
            const newHtml = fs.createWriteStream(pathToDestHTML);
            newHtml.write(innerHTML);
          });
        }
      });
    });
  });
};

// MAIN FUNCTION
const buildPage = () => {
  fs.rm(pathToDestDir, {force: true, recursive: true}, (err) => {
    if (err) throw err;
    fs.mkdir(pathToDestDir, {recursive: true}, (err) => {
      if (err) throw err;
      copyDir(pathToAssetsDir, path.join(pathToDestDir, 'assets')); //copy assets  
      bundleCSS(pathToStylesDir);
      bundleHTML();
    });
  });
};

buildPage();