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

// メモの追加
const createMemo = () => {
  const lines = []
  const reader = readline.createInterface(process.stdin)
  reader.on('line', (line) => {
    lines.push(line)
  })
  reader.on('close', () => {
    const fileName = String(lines[0])
    const text = lines.join('\n')
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

const deleteMemo = async () => {
  const question = {
    type: 'select',
    name: 'chooseMemo',
    message: 'Choose a memo you want to delete:',
    choices: getMemoTitles()
  }
  const answer = await enquirer.prompt(question)

  fs.unlinkSync(`./memos/${answer.chooseMemo}.txt`);
  console.log('削除しました。');
}

// メインロジック
function main (argv) {
  if (argv.r) {
    reference()
  } else if (argv.l) {
    getMemoTitles().forEach(memoTitle => {
      console.log(memoTitle)
    })
  } else if (argv.d) {
    deleteMemo()
  } else {
    createMemo()
  }
};

main(argv)
