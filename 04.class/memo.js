const fs = require('fs')
const enquirer = require('enquirer')
const minimist = require('minimist')
const readline = require('readline')

// ディレクトリが存在しなければ作成
const directoryPath = './memos'
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath)
}

// 標準入力の受け取り
const parseStdin = async () => {
  const buffers = []
  for await (const chunk of process.stdin) buffers.push(chunk)
  const text = String.prototype.concat(buffers)
  return text
}

// メモの追加
const createMemo = () => {
  parseStdin().then(text => {
    const fileName = text.split('\n')[0]
    fs.writeFileSync(`./memos/${fileName}.txt`, text)
  })
}

// メモの一覧表示
const generateChoices = () => {
  const files = fs.readdirSync('./memos')
  const choices = []
  files.forEach(filename => {
    choices.push(filename.split('.txt')[0])
  })
  return choices
}

const reference = async () => {
  const question = {
    type: 'select',
    name: 'chooseMemo',
    message: 'Choose a memo you want to see:',
    choices: generateChoices()
  }
  const answer = await enquirer.prompt(question)

  const stream = fs.createReadStream(`./memos/${answer.chooseMemo}.txt`, 'utf8')
  const rl = readline.createInterface({
    input: stream
  })

  rl.on('line', (lineString) => {
    console.log(lineString)
  })
}

reference()
