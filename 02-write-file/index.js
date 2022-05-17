const path = require('path');
const fs = require('fs');

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  'Hello world',
  (err) => {
    if (err) throw err;
  }
);