const fs = require('fs');
const { Transform } = require('stream');

function countWords(st) { 
  return st.trim().split(/\s+/).length;
} 

function toUpperCaseEveryThirdWord() { 
  let wordIndex = 0;
  
  const transformStream = new Transform({ 
    transform(chunk, encoding, callback) { 
      let text = chunk.toString();
      const words = text.split(/\s+/);
      
      for (let i = 2; i < words.length; i += 3) { 
        words[i] = words[i].toUpperCase();
      } 
      
      text = words.join(' ');
      this.push(text);
      callback();
    } 
  });
  
  return transformStream;
}

const inputStream = fs.createReadStream("Lection5.txt");
const outputStream = fs.createWriteStream('output.txt');

let total = 0;

inputStream
  .on('data', (chunk) => {
    const lines = chunk.toString().split('\n');
    lines.forEach((line) => {
      console.log(line);
      const wordCount = countWords(line);
      total += wordCount;
    });
  })
  .on('end', () => {
    console.log(`Total word count: ${total}`);
  })
  .on('error', (err) => {
    console.error('Error reading the file:', err);
    process.exit(1);
  });

inputStream.pipe(toUpperCaseEveryThirdWord()).pipe(outputStream);
