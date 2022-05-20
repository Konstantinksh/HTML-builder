const {readdir} = require ('fs/promises');
const {stat} = require ('fs');
const path = require('node:path');

const scaningDir = path.join(__dirname, 'secret-folder');

(async function (dir) {
  try {
    const arrOfFiles = await readdir(dir, {withFileTypes: true});
    arrOfFiles.forEach(el => {
      if (el.isFile()) {
        let output = el.name.split('.');
        const absPathToFile = path.resolve(__dirname, 'secret-folder', el.name);
        stat(absPathToFile, (err, stats) => {
          if (err) throw err;
          output.push(stats.size + 'b');
          console.log(output.join(' - '));
        });
      }
    });
  } catch (error) {
    console.error('there was an error:', error.message, error);
  }
})(scaningDir);