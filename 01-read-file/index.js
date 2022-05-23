const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

let text = '';
readableStream.on('data', chunk => text += chunk);
readableStream.on('end', () => console.log(text));
readableStream.on('error', error => console.log('Error', error.message));