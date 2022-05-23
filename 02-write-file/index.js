const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');
const { stdin: input, stdout: output} = require('node:process');

const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath, 'utf-8');

const rl = readline.createInterface({ input, output });

output.write('Dear Sir or Madame, write some text down below, if you please:\n');

const closeCommand = function() {  
  output.write('\nThx, seeYa!');
  rl.close();  
  process.exit();
};

rl.on('SIGINT', closeCommand);
rl.on('line', (text) => {
  if (text.toString().trim() === 'exit') {
    closeCommand();
  } else {
    writeableStream.write(`${text}\n`);
  }
});
rl.on('error', error => console.log('Error', error.message));