const fs = require('fs')
const readline = require('readline')
  
function countWords(st) { 
  return st.trim().split(/\s+/).length
} 
 
const Stream = fs.createReadStream("Lection5.txt")
const rl = readline.createInterface({ 
  input: Stream, 
  output: process.stdout, 
  terminal: false 
})
 
let total = 0 
 
rl.on('line', (line) => { 
  console.log(line)
  const wordCount = countWords(line)
  total += wordCount
})
 
rl.on('close', () => { 
  console.log(`Total word count: ${total}`)
  process.exit(0)
})


const Transform = require('stream').Transform
 
function toUpperCaseEveryThirdWord() { 
  
  const transformStream = new Transform({ 
    transform(chunk, encoding, callback) { 
      let text = chunk.toString()
      const word = text.split(' ')
 
      for (let i = 2; i < word.length; i += 3) { 
        word[i] = word[i].toUpperCase() 
      } 
 
      text = word.join(' ')
      this.push(text)
      callback()
    } 
  })
 
  return transformStream 
} 
 
rl 
  .on('line', (line) => { 
    toUpperCaseEveryThirdWord().write(line); 
  }) 
  .on('close', () => { 
    process.exit(0)
  }) 
 
Stream.pipe(toUpperCaseEveryThirdWord()).pipe(fs.createWriteStream('output.txt'))