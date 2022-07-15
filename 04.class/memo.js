const fs = require('fs')
const enquirer = require('enquirer')
const minimist = require('minimist')
const readline = require('readline')

// オプションの受け取り
const argv = minimist(process.argv.slice(2), {
  alias: {
    l: 'list',
    r: 'refer',
    d: 'delete'
  },
  default: {
    l: false,
    r: false,
    d: false
  }
})

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

// メモの一覧取得
const getMemoTitles = () => {
  const files = fs.readdirSync('./memos')
  const memoTitles = []
  files.forEach(filename => {
    memoTitles.push(filename.split('.txt')[0])
  })
  return memoTitles
}

// -rオプションの処理
const reference = async () => {
  const question = {
    type: 'select',
    name: 'chooseMemo',
    message: 'Choose a memo you want to see:',
    choices: getMemoTitles()
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

// メインロジック
function main (argv) {
  if (argv.r) {
    reference()
  } else if (argv.l) {
    getMemoTitles().forEach(memoTitle => {
      console.log(memoTitle)
    })
  } else {
    createMemo()
  }
};

main(argv)
